const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const authenticateToken = require("./middleware/authMiddleware");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("ChatConnect backend is running");
});

app.get("/api/protected", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();

    console.log("MySQL connected successfully");

    connection.release();
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }

  console.log(`Server is running on port ${PORT}`);
});