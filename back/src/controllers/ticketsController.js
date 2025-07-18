const pool = require('../config/db');

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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
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

    if(result.rowCount == 0)
        throw "Ticket not found";

    const subscribers = await pool.query('SELECT users.id, users.name, users.last_name FROM users JOIN tickets_subscribers AS subs ON subs.agent_id = users.id WHERE subs.ticket_id = $1', [ticket_id]);

    return res.status(200).json(
        { 
            ticket_info: result.rows[0],
            subscribers: subscribers.rows
        }
    );
} catch (err) {
    return res.status(500).json({ error: "Error happened" });
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
    return res.status(500).json({ error: "Error happened" });
}
};

