const pool = require('../config/db');

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
    const result = await pool.query("SELECT users.name, users.last_name, users.role, comments.text, comments.user_id, comments.id FROM comments INNER JOIN users ON users.id=comments.user_id WHERE comments.ticket_id = $1 ORDER BY created_at", [ticket_id]);

    return res.status(200).json(result.rows);
} catch (err) {
    res.status(500).json({ error: err });
}
};
