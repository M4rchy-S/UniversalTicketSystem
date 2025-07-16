import React from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const TicketInfo = ({userid, name, lastname, role}) =>{
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [socket, setSocket] = useState(null);

    const {ticketId} = useParams();

    const [comments, setComments] = useState([]);

    const [commentMessage, setCommentMessage] = useState("");

    const lastMessageRef = useRef(null);

    useEffect(() => {

        axios.get(`http://localhost:3000/api/ticket?ticket_id=${ticketId}`)
        .then((response) => {
            console.log(response);
            setDescription(response.data.description);
            setTitle(response.data.title);

            setLoading(false);
        })
        .catch( (error) => {
            console.log(error);
            setLoading(false);
        });

        axios.get(`http://localhost:3000/api/comments?ticket_id=${ticketId}`)
        .then((response) => {
            console.log(response.data);
            setComments(response.data);
            
        })
        .catch( (error) => {
            console.log(error);
        });

        const socket = io("http://localhost:4000", {
            withCredentials: true
        });
        setSocket(socket);

        socket.on('message', (response) => {
            socket_get_message(response);
        });

        socket.emit('joinRoom', {room: parseInt(ticketId)});
    
    }, []);

    function socket_send_message()
    {
        if(socket == null)
            return;

        socket.emit('send_message', { 
            msg: commentMessage,
            room: parseInt(ticketId)
        });
        
        setCommentMessage("");
    }
    
    function socket_get_message(data)
    {
        setComments(prev => [...prev, {
            name: data.name,
            last_name: data.last_name,
            role: data.role,
            text: data.text,
            user_id: data.user_id
        }]);
    }

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({behavior: "smooth"});
    }, [comments]);


    if(loading)
        return (
            <span className="loading loading-dots loading-xl"></span>
        )

    return(
        <>
            <h2 className='title'>Ticket Information</h2>

            <form action="" className='forms-html'>
                <div className='form-component'>
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Type here" className="input" value={title} readOnly/>
                </div>
                
                <div className='form-component'>
                    <label htmlFor="">Description</label>
                    <textarea className="textarea" placeholder="Bio" value={description} readOnly></textarea>
                </div>

                <label htmlFor="">Support Chat</label>
                <div className='form-component chat-component'>

                    {
                       comments.map( (comment, index) => 
                            parseInt( comment.user_id) == userid ? 
                            <div key={index} ref={index === comments.length - 1 ? lastMessageRef : null}>
                                <div className="chat chat-end">
                                    <div className="chat-header">
                                        {comment.name + " " + comment.last_name} 
                                    </div>

                                    <div className="chat-bubble">
                                        {comment.text}
                                    </div>
                                </div>
                            </div> 
                                : 
                            <div key={index} ref={index === comments.length - 1 ? lastMessageRef : null} >
                                <div className="chat chat-start">

                                    <div className="chat-header">
                                        {comment.name + " " + comment.last_name} 
                                    </div>

                                    <div className="chat-bubble">
                                        {comment.text}
                                    </div>
                                </div>
                            </div>
                            
                        )
                    }



                </div>

                <div className='form-component'>
                    <input type="text" placeholder="Type here" className="input"  value={commentMessage} onChange={e => setCommentMessage(e.target.value)}/>
                    <button type='button' className="btn btn-primary" onClick={socket_send_message}>Send Message</button>
                </div>



            </form>
        
        </>
    )
}

export default TicketInfo