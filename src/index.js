const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Node.js needs this to connect your DB to the controllers.
// If you're coming from Rails, we had a trusted guy called ActiveRecord — shoutout to that legend.
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// 🚑 Health Check — like checking the pulse of our app.
// In Rails, we might hit `/up` or check a background job dashboard.
// Here in Node.js, we ask Postgres: "Are you alive?" using SELECT NOW()
app.get('/health', async (req, res) => {
  try {
    const result = await req.db.query('SELECT NOW()');
    res.send({ status: 'ok', time: result.rows[0].now });
  } catch (err) {
    res.status(500).send({ error: 'Database exploded 💥', details: err });
  }
});

// Do you remember mounting engines or route namespaces in Rails?
// That’s exactly what we're doing here — just in Node.js style.
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
