const express = require("express");
const pool = require("../config/db");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message?.trim()) {
      return res.status(400).json({
        message: "Receiver and message are required",
      });
    }

    if (senderId === Number(receiverId)) {
      return res.status(400).json({
        message: "You cannot send a message to yourself",
      });
    }

    const [receivers] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [receiverId]
    );

    if (receivers.length === 0) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const cleanedMessage = message.trim();

    const [result] = await pool.query(
      `
      INSERT INTO messages (sender_id, receiver_id, message)
      VALUES (?, ?, ?)
      `,
      [senderId, receiverId, cleanedMessage]
    );

    return res.status(201).json({
      message: "Message sent successfully",
      data: {
        id: result.insertId,
        senderId,
        receiverId: Number(receiverId),
        message: cleanedMessage,
      },
    });
  } catch (error) {
    console.error("Send message error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/:userId", authenticateToken, async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const otherUserId = Number(req.params.userId);

    if (!Number.isInteger(otherUserId) || otherUserId <= 0) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (loggedInUserId === otherUserId) {
      return res.status(400).json({
        message: "Cannot retrieve a conversation with yourself",
      });
    }

    const [users] = await pool.query(
      "SELECT id FROM users WHERE id = ?",
      [otherUserId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const [messages] = await pool.query(
      `
      SELECT
        id,
        sender_id AS senderId,
        receiver_id AS receiverId,
        message,
        created_at AS createdAt
      FROM messages
      WHERE
        (sender_id = ? AND receiver_id = ?)
        OR
        (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC, id ASC
      `,
      [
        loggedInUserId,
        otherUserId,
        otherUserId,
        loggedInUserId,
      ]
    );

    return res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Fetch conversation error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

module.exports = router;