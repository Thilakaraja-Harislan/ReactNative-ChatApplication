const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ChatConnect backend is running");
});

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