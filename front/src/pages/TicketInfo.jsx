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
    const [images, setImages] = useState([]);

    const [socket, setSocket] = useState(null);

    const {ticketId} = useParams();

    const [comments, setComments] = useState([]);

    const [commentMessage, setCommentMessage] = useState("");

    const lastMessageRef = useRef(null);

    const [modalImageString, setModalImageString]  = useState("text");

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

            const file_paths = ticketInfo.images.split(';');
            for(let i = 0; i < file_paths.length; i++)
            {
                file_paths[i] = 'http://localhost:3000/images/' + file_paths[i]; 
            }

            setImages(file_paths);

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

    function handle_image_modal(event)
    {
        setModalImageString(event.target.src);

        document.getElementById('image_modal').showModal();
    }

  
    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({behavior: "smooth"});
    }, [comments])


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

                {
                    role != 'user' ?
                        iscurrentAgent 
                        ? <button type="button" onClick={unsubscribe_ticket} className="btn btn-primary btn-style">Unsubscribe</button>
                        : <button type="button" onClick={subscribe_ticket} className="btn btn-primary btn-style">Subscribe</button>
                    : <></>
                }

            </div>

            <div className='info-ticket-container'>

                <div className='left-chat-panel'>

                    <div className='chatMessages'>

                        {
                            comments.map((comment, index) =>
                                parseInt(comment.user_id) == userid ?
                                    <div key={index}>
                                        <div className="chat chat-end">
                                            <p className="chat-header">
                                                {comment.name + " " + comment.last_name}
                                            </p>

                                            <p className="chat-bubble chat-color wrap-text">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                    :
                                    <div key={index} >
                                        <div className="chat chat-start">

                                            <p className="chat-header">
                                                {comment.name + " " + comment.last_name}
                                            </p>

                                            <p className="chat-bubble chat-color wrap-text">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                            )
                        }

                        <div ref={lastMessageRef}></div>
                        
                    </div>

                    <div className='user-input'>

                        <textarea className="textarea text-no-resize" placeholder="Text input here" value={commentMessage} onChange={e => setCommentMessage(e.target.value)}/> 
                        <button className="btn btn-soft" onClick={socket_send_message}>Send message</button>

                    </div>

                   
                
                </div>

                <div className='right-info-panel'>
                    <h4>
                        Ticket Details
                    </h4>

                    <div className='ticket-details'>
                        <div>Assigned agent: 
                            {
                                agents.length != 0
                                    ? agents.map(( agent, index ) =>
                                        <p key={index}>
                                            {agent.name} {agent.last_name}
                                        </p>
                                    )
                                    :
                                    <p>
                                        No agents yet
                                    </p>
                            }
                        </div>
                        <p>Created xx/xx/xx </p>
                        <p>Status status </p>
                        <p>Description: {description}</p>
                        <p>Attachements</p>

                        <div className='images-container'>
                            {
                                images.map((image, index) =>
                                    <img className='attach-images' key={index} src={image} alt="" onClick={e => handle_image_modal(e)} />
                                )
                            }
                        </div>

                    </div>

                </div>
            </div>

            <dialog id="image_modal" className="modal">
                <div className="modal-box image-modal">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <img  className='modal-image-center' src={modalImageString} alt="" />
                </div>
            </dialog>
        </>
    )
}

export default TicketInfo