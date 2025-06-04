// Wanna add a new task to your life? Do it here.
async function createTask(req, res) {
  const { user_id, title, description } = req.body;

  if (!user_id || !title) {
    return res.status(400).json({ error: 'user_id and title are required' });
  }

  try {
    const result = await req.db.query(
      'INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [user_id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not create task', details: err });
  }
}

// Or maybe just want to see what chaos you've already created?
async function getAllTasks(req, res) {
  try {
    const result = await req.db.query('SELECT * FROM tasks ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve tasks', details: err });
  }
}

module.exports = {
  createTask,
  getAllTasks,
};
