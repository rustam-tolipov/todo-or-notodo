require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test DB connection
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send({ status: "ok", time: result.rows[0].now });
  } catch (err) {
    res.status(500).send({ error: "Database exploded 💥", details: err });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
