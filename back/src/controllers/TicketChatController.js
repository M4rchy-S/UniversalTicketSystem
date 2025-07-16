const pool = require('../config/db');

function WebSocketTicketChat(systemIO)
{
    const userRooms = new Map();

    systemIO.on("connection", (socket) => {
        
        const session = socket.request.session;

        if(session.email == null)
        {
            socket.disconnect(true);
            return;
        }

        console.log(`[+] User connected ${session.email}`);
        userRooms.set(socket.id, new Set());

        socket.on('joinRoom', async ( {room} ) => {

            try{

                if(session.role == 'user')
                {
                    const result = await pool.query("SELECT * FROM tickets WHERE author_id = $1 AND id = $2", [session.user_id, room]);
                    if(result.rowCount == 0)
                        throw "Invalid user";
                }

                socket.join(room);
                userRooms.get(socket.id).add(room);
                console.log(`[+] User ${session.email} joined the room ${room}`);

            }
            catch(err)
            {
                return socket.emit('error', 'Access denied to this room');
            }


        
        });

        socket.on('send_message', ({room, msg}) => {
            const rooms = userRooms.get(socket.id);
            if(!rooms || !rooms.has(room)){
                return socket.emit('error', 'Access denied to this room');
            }

            systemIO.to(room).emit('message', {
                name: session.name,
                last_name: session.last_name,
                role: session.role,
                text: msg,
                user_id: session.user_id
            });

            pool.query("INSERT INTO comments (ticket_id, user_id, text) VALUES ($1, $2, $3)", [room, session.user_id, msg]);
            
            console.log(`[+] User ${session.email} send message to room ${room}`);


        });

        socket.on('disconnect', () => {
            console.log(`[-] User ${session.email} disconnected`);
            userRooms.delete(socket.id);
        });

    });
}


module.exports = WebSocketTicketChat;