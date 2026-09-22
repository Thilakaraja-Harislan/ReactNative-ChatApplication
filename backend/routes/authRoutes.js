const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_WEB_CLIENT_ID
);

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
      `,
      [name, email.toLowerCase(), passwordHash]
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.insertId,
        name,
        email: email.toLowerCase(),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email.toLowerCase()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

const user = users[0];

if (!user.password_hash) {
  return res.status(401).json({
    message: "This account uses Google Sign-In. Please continue with Google.",
  });
}

const isPasswordValid = await bcrypt.compare(
  password,
  user.password_hash
);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Google ID token is required",
      });
    }

    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({
        message: "Invalid Google token",
      });
    }

    const {
      sub: googleId,
      email,
      name,
      picture,
      email_verified: emailVerified,
    } = payload;

    if (!email || !emailVerified) {
      return res.status(401).json({
        message: "Google email is not verified",
      });
    }

    const normalizedEmail = email.toLowerCase();

    // First check whether this Google account already exists
    let [users] = await pool.query(
      "SELECT * FROM users WHERE google_id = ?",
      [googleId]
    );

    let user;

    if (users.length > 0) {
      // Existing Google user
      user = users[0];
    } else {
      // Check whether the email already exists
      [users] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [normalizedEmail]
      );

      if (users.length > 0) {
        // Existing email/password account:
        // link the Google account to it.
        user = users[0];

        await pool.query(
          `
          UPDATE users
          SET google_id = ?,
              profile_picture = COALESCE(profile_picture, ?)
          WHERE id = ?
          `,
          [googleId, picture || null, user.id]
        );

        user.google_id = googleId;

        if (!user.profile_picture) {
          user.profile_picture = picture || null;
        }
      } else {
        // Completely new user
        const userName =
          name || normalizedEmail.split("@")[0];

        const [result] = await pool.query(
          `
          INSERT INTO users
          (name, email, password_hash, google_id, profile_picture)
          VALUES (?, ?, NULL, ?, ?)
          `,
          [
            userName,
            normalizedEmail,
            googleId,
            picture || null,
          ]
        );

        user = {
          id: result.insertId,
          name: userName,
          email: normalizedEmail,
          google_id: googleId,
          profile_picture: picture || null,
        };
      }
    }

    // Generate ChatConnect's JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Google login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePicture: user.profile_picture || null,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      message: "Google authentication failed",
    });
  }
});

module.exports = router;