const pool = require('../config/db');
const bcrypt = require('bcrypt');
const saltsRounds = 15;

//  Users
exports.getUsers = async (req, res) => {
  try {
    if(req.session.role != "admin")
      return res.status(400).json({msg: "Permission denied"});

    const result = await pool.query("SELECT id,name, last_name, email, role FROM users WHERE role != 'admin' ");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getPeersonalUserInfo = async (req, res) => {
  try {
    if(!req.session.email )
      return res.status(400).json({msg: "Not authorised"});

    const email = req.session.email;
    
    const result = await pool.query('SELECT id,name, last_name, email, role FROM users WHERE email = $1', [email]);

    if(result.rowCount == 0)
      throw "User not found";

    req.session.name = result.rows[0].name;
    req.session.last_name = result.rows[0].last_name;
    req.session.role = result.rows[0].role;

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getSpecificUserInfo = async (req, res) => {
  try {
    if(req.session.role == 'user')
      return res.status(400).json({msg: "Permission Denied"});

    const { email } = req.query;
    
    const result = await pool.query('SELECT id,name, last_name, email, role FROM users WHERE email = $1', [email]);

    if(result.rowCount == 0)
      throw "User not found";

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
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
    req.session.user_id = result.rows[0].id;

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err });
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
    req.session.user_id = result.rows[0].id;

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: "Error happened" });
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
    res.status(500).json({ error: err });
  }
};

exports.updateUserPassword = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(404).json({msg: "Not initialised"});

    const email = req.session.email;
    const {old_password, new_password} = req.body;

    let result = await pool.query('SELECT password FROM users WHERE email = $1', [email]);
    if(result.rowCount == 0)
      throw "User not found";

    const isMatched = await bcrypt.compare(old_password, result.rows[0].password);
    if(!isMatched)
      throw "Password is not correct";

    const hashed_new_password = await bcrypt.hash(new_password, saltsRounds);
    result = await pool.query('UPDATE users SET password = $1 WHERE email = $2 RETURNING *', [hashed_new_password, email]);

    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err });
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
    res.status(500).json({ error: err });
  }
};

exports.logOut = async (req, res) => {
  
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).send({"msg": "Logged out"});
  });
};

//  Tickets
exports.CreateTicket = async (req, res) => {
  try {
    if(!req.session.email )
      return res.status(400).json({msg: "Not authorised"});

    const { title, description } = req.body;
    const author_id = req.session.user_id;

    const result = await pool.query('INSERT INTO tickets (title, description, status, author_id) VALUES ($1, $2, $3, $4) RETURNING *', [title, description, 0, author_id]);

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.DeleteTicket = async (req, res) => {
  try {
    if(req.session.role != 'admin' )
      return res.status(400).json({msg: "Permission denied"});

    const { ticket_id } = req.query;

    let result = await pool.query('DELETE FROM comments WHERE ticket_id = $1', [ticket_id]);
    result = await pool.query('DELETE FROM tickets WHERE id = $1', [ticket_id]);

    return res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


exports.ChangeTicketStatus = async (req, res) => {
  try {
    if(req.session.role == 'user' )
      return res.status(400).json({msg: "Permission denied"});

    const { ticket_id, new_status } = req.body;
    if(new_status < 0 || new_status > 2)
      throw "Invalid status";

    const result = await pool.query('UPDATE tickets SET status = $1 WHERE id = $2', [new_status, ticket_id]);

    return res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.GetAllTickets = async (req, res) => {
  try {
    if(req.session.role == 'user' )
      return res.status(400).json({msg: "Permission denied"});

    const { status } = req.query;

    let result = null;

    if(status == null)
    {
      result = await pool.query("SELECT * FROM tickets ORDER BY created_at DESC");
    }
    else
    {
      if(parseInt(status) < 0 || parseInt(status) > 2)
        throw "Invalid status";

      result = await pool.query("SELECT * FROM tickets WHERE status = $1 ORDER BY created_at DESC", [status]);
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.GetTicketInfo = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(400).json({msg: "Not authorised"});

    const { ticket_id } = req.query;
    const author_id = req.session.user_id;
    let result = null;

    if(req.session.role == 'user')
    {
      result = await pool.query('SELECT * FROM tickets WHERE author_id = $1 AND id = $2', [author_id, ticket_id]);
    }
    else
    {
      result = await pool.query('SELECT * FROM tickets WHERE id = $1', [ticket_id]);
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.GetPersonalTickets = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(400).json({msg: "Not authorised"});

    const author_id = req.session.user_id;

    const result = await pool.query("SELECT * FROM tickets WHERE author_id = $1 ORDER BY created_at DESC", [author_id]);

    return res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};


//  Comments
exports.CreateComment = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(400).json({msg: "Not authorised"});
    
    const {ticket_id, message} = req.body
    const author_id = req.session.user_id;

    if(req.session.role == 'user')
    {
      const result = await pool.query("SELECT * FROM tickets WHERE author_id = $1 AND id = $2", [author_id, ticket_id]);
      if(result.rowCount == 0)
        throw "Invalid user";
    }
    
    const result = await pool.query("INSERT INTO comments (ticket_id, user_id, text) VALUES ($1, $2, $3)", [ticket_id, author_id, message]);

    return res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.GetComments = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(400).json({msg: "Not authorised"});

    const {ticket_id} = req.query;
    const author_id = req.session.user_id;

    if(req.session.role == 'user')
    {
      const result = await pool.query("SELECT * FROM tickets WHERE author_id = $1 AND id = $2", [author_id, ticket_id]);
      if(result.rowCount == 0)
        throw "Invalid user";
    }

    // const result = await pool.query("SELECT * FROM comments WHERE ticket_id = $1 ORDER BY created_at DESC", [ticket_id]);
    const result = await pool.query("SELECT users.name, users.last_name, users.role, comments.text, comments.user_id FROM comments INNER JOIN users ON users.id=comments.user_id WHERE comments.ticket_id = $1 ORDER BY created_at", [ticket_id]);

    return res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

//  Change roles

exports.ChangeRole = async (req, res) => {
  try {
    if(req.session.role != 'admin')
      throw "Permission denied";

    const {user_id, role} = req.body;

    if(role != 'user' && role != 'agent')
      throw "Invalid role permission";
    
    if(user_id == 1)
      throw "Invalid user_id";
      

    const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, user_id]);

    return res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};



