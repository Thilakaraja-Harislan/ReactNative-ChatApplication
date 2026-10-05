from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Allow the React Native frontend to communicate with this backend
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


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )