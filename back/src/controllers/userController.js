const pool = require('../config/db');
const bcrypt = require('bcrypt');
const saltsRounds = 15;


exports.getUsers = async (req, res) => {
  try {
    if(req.session.role != "admin")
      return res.status(400).json({msg: "Permission denied"});

    const result = await pool.query('SELECT * FROM users');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    if(!req.session.email )
      return res.status(400).json({msg: "Not authorised"});

    let email = null;
    
    if(req.session.role == 'agent' || req.session.role == 'admin')
      if(req.query.email)
        email = req.query.email;
      else
        email = req.session.email;
    else
      email = req.session.email;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if(result.rowCount == 0)
      throw "User not found";

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logIn = async (req, res) => {
  try {

    if(req.session.email)
      return res.status(404).json({msg: "Already in session"});

    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if(result.rowCount == 0)
      throw "Could not find user";
    
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    
    if(!isMatch)
      throw "Invalid password";

    req.session.email = result.rows[0].email;
    req.session.role = result.rows[0].role;

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    if(req.session.email)
      return res.status(404).json({msg: "Already in session"});

    const { name, last_name, email } = req.body;
    const password = await bcrypt.hash(req.body.password, saltsRounds);

    const result = await pool.query('INSERT INTO users (name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, last_name, email, password, 'user']);

    req.session.email = email;
    req.session.role = 'user';

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserNames = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(404).json({msg: "Not initialised"});

    const { name, last_name } = req.body;
    const email = req.session.email;

    const result = await pool.query('UPDATE users SET name = $1, last_name = $2 WHERE email = $3 RETURNING *', [name, last_name, email]);
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(404).json({msg: "Not initialised"});

    const email = req.session.email;

    const old_password = await bcrypt.hash(req.body.old_password, saltsRounds);
    const new_password = await bcrypt.hash(req.body.new_password, saltsRounds);


    let result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, old_password]);
    if(result.rowCount == 0)
      throw "Invalid password";

    result = await pool.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [new_password, email]);

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if(req.session.role != "admin")
      return res.status(400).json({msg: "Permission denied"});

    const { email } = req.body;

    await pool.query('DELETE FROM users WHERE email = $1', [email]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logOut = async (req, res) => {
  
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).send({"msg": "Logged out"});
  });
 
};