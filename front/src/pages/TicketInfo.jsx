import React from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import '../components/quill.css'

const TicketInfo = ({userid, name, lastname, role}) =>{
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [socket, setSocket] = useState(null);

    const {ticketId} = useParams();

    const [comments, setComments] = useState([]);

    const [commentMessage, setCommentMessage] = useState("");

    const lastMessageRef = useRef(null);

    const [agents, setAgents] = useState([]);

    const [iscurrentAgent, setIscurrentagent] = useState(false);

    //  Get ticket info
    useEffect(() => {

        axios.get(`http://localhost:3000/api/ticket?ticket_id=${ticketId}`)
        .then((response) => {
            console.log(response);

            const ticketInfo = response.data.ticket_info;
            const subscribers = response.data.subscribers;

            setAgents(subscribers);

            setTitle(ticketInfo.title);
            setDescription(ticketInfo.description);

            for(let i = 0; i < subscribers.length; i++)
            {
                if(subscribers[i].id == userid)
                {
                    setIscurrentagent(true);
                    break;
                }
            }

            setLoading(false);
        })
        .catch( (error) => {
            console.log(error);
            alert("Error happened");
            setLoading(false);
        });

    }, [iscurrentAgent]);

    //  Get comments
    useEffect( () => {
        axios.get(`http://localhost:3000/api/comments?ticket_id=${ticketId}`)
        .then((response) => {
            console.log(response.data);
            setComments(response.data);
            
        })
        .catch( (error) => {
            console.log(error);
            alert("Error happened");
        });
    }, []);


    //  Get WebSocket
    useEffect( () => {
        const socket = io("http://localhost:4000", {
            withCredentials: true
        });
        setSocket(socket);

        socket.on('message', (response) => {
            socket_get_message(response);
        });

        socket.emit('joinRoom', { 
            room: parseInt(ticketId)
        });
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

    function subscribe_ticket()
    {
        axios.post("http://localhost:3000/api/sub-ticket", {
            ticket_id: parseInt(ticketId)
        })
        .then( (response) => {
            setIscurrentagent(true);
        } )
        .catch( (err) => {
            console.log(err);
        });
    }

    function unsubscribe_ticket()
    {
        axios.put("http://localhost:3000/api/sub-ticket", {
            ticket_id: parseInt(ticketId)
        })
        .then( (response) => {
            setIscurrentagent(false);
        } )
        .catch( (err) => {
            console.log(err);
        });
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
            <div className='home-title ticket-info-title'>
                <h4>
                    Ticket Information 
                </h4>

                <h4>Title: {title}</h4>

                <button type="submit" className="btn btn-primary btn-style" onClick={()=>document.getElementById('create-ticket-modal').showModal()}>
                    Assign to ticket
                </button>

            </div>

            <div className='info-ticket-container'>

                <div className='left-chat-panel'>

                    <div class='chatMessages'>
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Obi-Wan Kenobi
                                <time className="text-xs opacity-50">12:45</time>
                            </div>
                            <div className="chat-bubble">You were the Chosen One!</div>
                            <div className="chat-footer opacity-50">Delivered</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Obi-Wan Kenobi
                                <time className="text-xs opacity-50">12:45</time>
                            </div>
                            <div className="chat-bubble">You were the Chosen One!</div>
                            <div className="chat-footer opacity-50">Delivered</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                        <div className="chat chat-start">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Obi-Wan Kenobi
                                <time className="text-xs opacity-50">12:45</time>
                            </div>
                            <div className="chat-bubble">You were the Chosen One!</div>
                            <div className="chat-footer opacity-50">Delivered</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                        <div className="chat chat-end">
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS chat bubble component"
                                        src="https://img.daisyui.com/images/profile/demo/anakeen@192.webp"
                                    />
                                </div>
                            </div>
                            <div className="chat-header">
                                Anakin
                                <time className="text-xs opacity-50">12:46</time>
                            </div>
                            <div className="chat-bubble">I hate you!</div>
                            <div className="chat-footer opacity-50">Seen at 12:46</div>
                        </div>
                        
                        
                        
                    </div>

                    <div class='user-input'>

                        <textarea className="textarea" placeholder="Text input here"></textarea>
                        <button className="btn btn-soft">Send message</button>

                    </div>

                   
                
                </div>

                <div className='right-info-panel'>
                    <h4>
                        Ticket Details
                    </h4>

                    <div className='ticket-details'>
                        <p>Assigned agent -- Name --</p>
                        <p>Created xx/xx/xx </p>
                        <p>Status status </p>
                        <p>Description: efwafawefawef wefawfawefawfwfwfwfw </p>
                        <p>Attachements</p>
                    </div>

                </div>
            </div>



            <form action="" className='forms-html'>
                <div className='form-component'>
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Type here" className="input" value={title} readOnly/>
                </div>
                
                <div className='form-component'>
                    <label htmlFor="">Description</label>
                    <ReactQuill readOnly={true} className='quill' theme="snow" value={description}/>
                </div>

                <div>
                    <label htmlFor="">Subscribed agents</label>

                    {
                        agents.length != 0 
                        ?   agents.map( agent => 
                                <p>{agent.name} {agent.last_name}</p>
                            )
                        : <p>No agents yet</p>
                    }

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

                                    <div className="chat-bubble chat-color">
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

                {
                    role != 'user' ?
                        iscurrentAgent 
                        ? <button type="button" onClick={unsubscribe_ticket} className="btn btn-warning">Unsubscribe</button>
                        : <button type="button" onClick={subscribe_ticket} className="btn btn-warning">Subscribe</button>
                    : <></>
                }

            </form>
        
        </>
    )
}

export default TicketInfo