import os
from functools import wraps

import jwt
from dotenv import load_dotenv
from flask import g, jsonify, request


load_dotenv()


def authenticate_token(route_function):
    @wraps(route_function)
    def wrapper(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "message": "Access token is required"
            }), 401

        parts = auth_header.split(" ")

        if len(parts) < 2 or not parts[1]:
            return jsonify({
                "message": "Access token is required"
            }), 401

        token = parts[1]

        try:
            decoded = jwt.decode(
                token,
                os.getenv("JWT_SECRET"),
                algorithms=["HS256"]
            )

            # Equivalent to Node's:
            # req.user = decoded
            g.user = decoded

            return route_function(*args, **kwargs)

        except jwt.PyJWTError:
            return jsonify({
                "message": "Invalid or expired token"
            }), 401

    return wrapper