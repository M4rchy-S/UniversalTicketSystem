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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
  }
};



exports.logIn = async (req, res) => {
  try {

    if(req.session.email)
      return res.status(404).json({msg: "Already in session"});

    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if(result.rowCount == 0)
      throw "This user is not registered";
    
    const isMatch = await bcrypt.compare(password, result.rows[0].password);
    
    if(!isMatch)
      throw "Password is incorrect";

    req.session.email = result.rows[0].email;
    req.session.role = result.rows[0].role;
    req.session.user_id = result.rows[0].id;

    res.status(201).send();
  } catch (err) {
    return res.status(500).json({ errors: err });
  }
};

exports.createUser = async (req, res) => {
  try {
    if(req.session.email)
      return res.status(404).json({msg: "Already in session"});

    const { name, last_name, email } = req.body;
    //  Validate fields
    const collision = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if(collision.rowCount != 0)
      throw "Email is already registered";

    //  Create user 
    if(req.body.password != req.body.rep_password)
      throw "Passwords are not matched";

    const password = await bcrypt.hash(req.body.password, saltsRounds);
    const rep_password = await bcrypt.hash(req.body.rep_password, saltsRounds);

    const result = await pool.query('INSERT INTO users (name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, last_name, email, password, 'user']);

    req.session.email = email;
    req.session.role = 'user';
    req.session.user_id = result.rows[0].id;

    res.status(201).send();
  } catch (err) {
    res.status(500).json({ errors: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
  }
};

exports.deleteYourself = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(404).json({msg: "Not initialised"});
    if(req.session.role == "admin")
      return res.status(404).json({msg: "Denied permission"});

    const email  = req.session.email;

    await pool.query('DELETE FROM users WHERE email = $1', [email]);

    req.session.destroy( err => {
      if(err){
        throw "Error in session cleaning";
      }
    });

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

exports.logOut = async (req, res) => {
  
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).send({"msg": "Logged out"});
  });
};

//  Change roles
exports.ChangeRole = async (req, res) => {
  try {
    if(!req.session.email)
      return res.status(400).json({msg: "Not authorised"});

    if(req.session.role != 'admin')
      return res.status(400).json({msg: "Permission denied"});

    const {user_id, role} = req.body;

    if(role != 'user' && role != 'agent')
      throw "Invalid role permission";
    
    if(user_id == 1)
      throw "Invalid user_id";
      

    const result = await pool.query("UPDATE users SET role = $1 WHERE id = $2", [role, user_id]);

    return res.status(200).send();
  } catch (err) {
    return res.status(500).json({ error: "Error happened" });
  }
};

exports.SubscribeTicket = async (req, res) => {
  try{
    if(!req.session.email)
      return res.status(400).json({msg: "Not authorised"});

    if(req.session.role == "user")
      return res.status(400).json({msg: "Permission denied"});

    const { ticket_id } = req.body;

    const result = await pool.query("INSERT INTO tickets_subscribers (ticket_id, agent_id) VALUES ($1, $2)", [ticket_id, req.session.user_id]);

    return res.status(200).send();
  }
  catch(err){
   return res.status(500).json({ error: "Error happened" });
  }

};

exports.UnsubscribeTicket = async (req, res) => {
  try{
    if(!req.session.email)
      throw "Not authorised";

    if(req.session.role == "user")
      return res.status(400).json({msg: "Permission denied"});

    const { ticket_id } = req.body;

    const result = await pool.query("DELETE FROM tickets_subscribers WHERE ticket_id = $1 AND agent_id = $2", [ticket_id, req.session.user_id]);

    return res.status(200).send();

  }
  catch(err){
   return res.status(500).json({ error: "Error happened" });
  }

};




