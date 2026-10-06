from flask import Flask, jsonify, g
from flask_cors import CORS

from config.db import get_db_connection
from routes.auth_routes import auth_bp
from routes.user_routes import user_bp
from routes.message_routes import message_bp
from middleware.auth_middleware import authenticate_token
from flask_socketio import SocketIO, join_room


app = Flask(__name__)
CORS(app)

socketio = SocketIO(
    app,
    cors_allowed_origins="*"
)


# Register authentication routes
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    user_bp,
    url_prefix="/api/users"
)

app.register_blueprint(
    message_bp,
    url_prefix="/api/messages"
)

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Python Chat Application Backend is running"
    }), 200


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "success",
        "message": "Python backend is healthy"
    }), 200


@app.route("/api/health/db", methods=["GET"])
def database_health_check():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT DATABASE()")
        database_name = cursor.fetchone()[0]

        return jsonify({
            "status": "success",
            "message": "MySQL database connection successful",
            "database": database_name
        }), 200

    except Exception as error:
        return jsonify({
            "status": "error",
            "message": "MySQL database connection failed",
            "error": str(error)
        }), 500

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None:
            connection.close()


@app.route("/api/protected-test", methods=["GET"])
@authenticate_token
def protected_test():
    return jsonify({
        "message": "Protected route accessed successfully",
        "user": g.user
    }), 200

@socketio.on("connect")
def handle_connect():
    print("Socket connected")


@socketio.on("register-user")
def handle_register_user(user_id):
    join_room(f"user:{user_id}")

    print(f"User {user_id} registered with socket")
    

@socketio.on("disconnect")
def handle_disconnect():
    print("Socket disconnected")


if __name__ == "__main__":
    socketio.run(
        app,
        host="0.0.0.0",
        port=5000,
        debug=True,
        allow_unsafe_werkzeug=True
    )