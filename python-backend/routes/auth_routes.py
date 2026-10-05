import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request

from config.db import get_db_connection


load_dotenv()

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    connection = None
    cursor = None

    try:
        data = request.get_json(silent=True) or {}

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({
                "message": "Name, email, and password are required"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({
                "message": "Email is already registered"
            }), 409

        normalized_email = email.lower()

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt(rounds=10)
        ).decode("utf-8")

        cursor.execute(
            """
            INSERT INTO users (name, email, password_hash)
            VALUES (%s, %s, %s)
            """,
            (
                name,
                normalized_email,
                password_hash
            )
        )

        connection.commit()

        user_id = cursor.lastrowid

        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": user_id,
                "name": name,
                "email": normalized_email
            }
        }), 201

    except Exception as error:
        print("Registration error:", error)

        if connection is not None:
            connection.rollback()

        return jsonify({
            "message": "Internal server error"
        }), 500

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    connection = None
    cursor = None

    try:
        data = request.get_json(silent=True) or {}

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({
                "message": "Email and password are required"
            }), 400

        normalized_email = email.lower()

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM users WHERE email = %s",
            (normalized_email,)
        )

        user = cursor.fetchone()

        if not user:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        if not user.get("password_hash"):
            return jsonify({
                "message": "This account uses Google Sign-In. Please continue with Google."
            }), 401

        password_is_valid = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password_hash"].encode("utf-8")
        )

        if not password_is_valid:
            return jsonify({
                "message": "Invalid email or password"
            }), 401

        jwt_secret = os.getenv("JWT_SECRET")

        now = datetime.now(timezone.utc)

        token = jwt.encode(
            {
                "id": user["id"],
                "email": user["email"],
                "iat": now,
                "exp": now + timedelta(hours=1)
            },
            jwt_secret,
            algorithm="HS256"
        )

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    except Exception as error:
        print("Login error:", error)

        return jsonify({
            "message": "Internal server error"
        }), 500

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()