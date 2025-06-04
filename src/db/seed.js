require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  try {
    console.log("🌱 Seeding started...");

    // Clear existing data
    await pool.query("DELETE FROM tasks");
    await pool.query("DELETE FROM users");

    // Insert users
    const users = ["maksim", "albert", "noob"];
    const userInserts = await Promise.all(
      users.map((username) =>
        pool.query(
          "INSERT INTO users (username) VALUES ($1) RETURNING *",
          [username]
        )
      )
    );

    // Grab user IDs
    const userIds = userInserts.map((res) => res.rows[0].id);

    // Insert tasks
    const tasks = [
      {
        user_id: userIds[0],
        title: "Fix the thing",
        description: "You know the one",
      },
      {
        user_id: userIds[1],
        title: "Push to GitHub",
        description: "And make it look like I knew what I was doing",
      },
      {
        user_id: userIds[2],
        title: "Document it",
        description: "In a well-structured README, of course",
      },
    ];

    for (const task of tasks) {
      await pool.query(
        "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3)",
        [task.user_id, task.title, task.description]
      );
    }

    console.log("✅ Done! Your DB has fresh users and tasks.");
    process.exit();
  } catch (err) {
    console.error("❌ Seed failed, but why?", err);
    process.exit(1);
  }
}

seed();
