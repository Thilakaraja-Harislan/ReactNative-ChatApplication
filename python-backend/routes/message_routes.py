from flask import Blueprint, jsonify, request, g

from config.db import get_db_connection
from middleware.auth_middleware import authenticate_token


message_bp = Blueprint("messages", __name__)


@message_bp.route("", methods=["POST"])
@authenticate_token
def send_message():
    connection = None
    cursor = None

    try:
        sender_id = g.user["id"]

        data = request.get_json(silent=True) or {}

        receiver_id = data.get("receiverId")
        message = data.get("message")

        if not receiver_id or not isinstance(message, str) or not message.strip():
            return jsonify({
                "message": "Receiver and message are required"
            }), 400

        try:
            receiver_id_number = int(receiver_id)
        except (TypeError, ValueError):
            return jsonify({
                "message": "Receiver and message are required"
            }), 400

        if sender_id == receiver_id_number:
            return jsonify({
                "message": "You cannot send a message to yourself"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT id FROM users WHERE id = %s",
            (receiver_id,)
        )

        receiver = cursor.fetchone()

        if receiver is None:
            return jsonify({
                "message": "Receiver not found"
            }), 404

        cleaned_message = message.strip()

        cursor.execute(
            """
            INSERT INTO messages (sender_id, receiver_id, message)
            VALUES (%s, %s, %s)
            """,
            (
                sender_id,
                receiver_id,
                cleaned_message
            )
        )

        connection.commit()

        saved_message = {
            "id": cursor.lastrowid,
            "senderId": sender_id,
            "receiverId": receiver_id_number,
            "message": cleaned_message
        }

        return jsonify({
            "message": "Message sent successfully",
            "data": saved_message
        }), 201

    except Exception as error:
        print("Send message error:", error)

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


@message_bp.route("/<user_id>", methods=["GET"])
@authenticate_token
def get_conversation(user_id):
    connection = None
    cursor = None

    try:
        logged_in_user_id = g.user["id"]

        try:
            other_user_id = int(user_id)
        except (TypeError, ValueError):
            return jsonify({
                "message": "Invalid user ID"
            }), 400

        if other_user_id <= 0:
            return jsonify({
                "message": "Invalid user ID"
            }), 400

        if logged_in_user_id == other_user_id:
            return jsonify({
                "message": "Cannot retrieve a conversation with yourself"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            "SELECT id FROM users WHERE id = %s",
            (other_user_id,)
        )

        user = cursor.fetchone()

        if user is None:
            return jsonify({
                "message": "User not found"
            }), 404

        cursor.execute(
            """
            SELECT
                id,
                sender_id AS senderId,
                receiver_id AS receiverId,
                message,
                created_at AS createdAt
            FROM messages
            WHERE
                (sender_id = %s AND receiver_id = %s)
                OR
                (sender_id = %s AND receiver_id = %s)
            ORDER BY created_at ASC, id ASC
            """,
            (
                logged_in_user_id,
                other_user_id,
                other_user_id,
                logged_in_user_id
            )
        )

        messages = cursor.fetchall()

        return jsonify({
            "messages": messages
        }), 200

    except Exception as error:
        print("Fetch conversation error:", error)

        return jsonify({
            "message": "Internal server error"
        }), 500

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()