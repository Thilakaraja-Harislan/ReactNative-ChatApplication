from flask import Blueprint, jsonify, g

from config.db import get_db_connection
from middleware.auth_middleware import authenticate_token


user_bp = Blueprint("users", __name__)


@user_bp.route("", methods=["GET"])
@authenticate_token
def get_users():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT id, name, email, created_at
            FROM users
            WHERE id != %s
            ORDER BY name ASC
            """,
            (g.user["id"],)
        )

        users = cursor.fetchall()

        return jsonify({
            "users": users
        }), 200

    except Exception as error:
        print("Fetch users error:", error)

        return jsonify({
            "message": "Internal server error"
        }), 500

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()