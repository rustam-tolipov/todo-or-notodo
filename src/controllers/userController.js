// You wanna create a new user? This is how we do it.
async function createUser(req, res) {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const result = await req.db.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not create user', details: err });
  }
}

// Or trying to get users (all of them)? This is the command.
async function getAllUsers(req, res) {
  try {
    const result = await req.db.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Could not retrieve users', details: err });
  }
}

module.exports = {
  createUser,
  getAllUsers,
};
