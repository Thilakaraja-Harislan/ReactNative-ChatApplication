const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      `
      SELECT id, name, email, created_at
      FROM users
      WHERE id != ?
      ORDER BY name ASC
      `,
      [req.user.id]
    );

    return res.status(200).json({
      users,
    });
  } catch (error) {
    console.error("Fetch users error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;