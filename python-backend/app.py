from flask import Flask, jsonify
from flask_cors import CORS

from config.db import get_db_connection

app = Flask(__name__)
CORS(app)


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


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )