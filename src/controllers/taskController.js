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
  const { user_id } = req.query;
  try {
    let result;

    if (user_id) {
      result = await req.db.query(
        'SELECT * FROM tasks Where user_id = $1 ORDER BY id ASC',
        [user_id]
      );
    } else {
      result = await req.db.query('SELECT * FROM tasks ORDER BY id ASC');
    }

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve tasks', details: err });
  }
}

// Flip the completed status of a task
async function toggleTaskComplete(req, res) {
  const taskId = req.params.id;

  try {
    const { rows } = await req.db.query(
      'SELECT completed FROM tasks WHERE id = $1',
      [taskId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const currentStatus = rows[0].completed;
    const newStatus = !currentStatus;

    const update = await req.db.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [newStatus, taskId]
    );

    res.json(update.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not toggle task', details: err });
  }
}

// Remove a task from your life. It's gone. Forever. (but speficy what you are deleting)
async function deleteTask(req, res) {
  const taskId = req.params.id;

  try {
    const result = await req.db.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete task', details: err });
  }
}

module.exports = {
  createTask,
  getAllTasks,
  toggleTaskComplete,
  deleteTask,
};
