const jwt = require("jsonwebtoken");
const authenticateToken = require("../../middleware/authMiddleware");

jest.mock("jsonwebtoken");

describe("authenticateToken", () => {
  test("should return 401 when authorization header is missing", () => {
    const req = {
      headers: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      message: "Access token is required",
    });

    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 when token is missing from authorization header", () => {
  const req = {
    headers: {
      authorization: "Bearer",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  authenticateToken(req, res, next);

  expect(res.status).toHaveBeenCalledWith(401);

  expect(res.json).toHaveBeenCalledWith({
    message: "Access token is required",
  });

  expect(next).not.toHaveBeenCalled();
});

test("should return 401 when token is invalid or expired", () => {
  const req = {
    headers: {
      authorization: "Bearer invalid-token",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  jwt.verify.mockImplementation(() => {
    throw new Error("Invalid token");
  });

  authenticateToken(req, res, next);

  expect(jwt.verify).toHaveBeenCalledWith(
    "invalid-token",
    process.env.JWT_SECRET
  );

  expect(res.status).toHaveBeenCalledWith(401);

  expect(res.json).toHaveBeenCalledWith({
    message: "Invalid or expired token",
  });

  expect(next).not.toHaveBeenCalled();
});

test("should set req.user and call next when token is valid", () => {
  const req = {
    headers: {
      authorization: "Bearer valid-token",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  const decodedUser = {
    id: 1,
    email: "test@example.com",
  };

  jwt.verify.mockReturnValue(decodedUser);

  authenticateToken(req, res, next);

  expect(jwt.verify).toHaveBeenCalledWith(
    "valid-token",
    process.env.JWT_SECRET
  );

  expect(req.user).toEqual(decodedUser);

  expect(next).toHaveBeenCalled();

  expect(res.status).not.toHaveBeenCalled();
  expect(res.json).not.toHaveBeenCalled();
});
});