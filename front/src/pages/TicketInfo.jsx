import React from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';

const TicketInfo = ({userid, name, lastname, role}) =>{
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const {ticketId} = useParams();

    const [comments, setComments] = useState([]);

    const [commentMessage, setCommentMessage] = useState("");

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

    }, []);

    function handleCreateComment()
    {
        if(commentMessage.length == 0)
            return;

        axios.post('http://localhost:3000/api/create-comment', {
            ticket_id: ticketId,
            message: commentMessage
        })
        .then((response) => {
            console.log(response.data);

            setComments([...comments, {
                name: name,
                last_name: lastname,
                role: role,
                text: commentMessage,
                user_id: userid

            }]);

        })
        .catch( (error) => {
            console.log(error);
        });

    }

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

                    {/* <div className="chat chat-start">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">You were the Chosen One!</div>
                    </div>

                    <div className="chat chat-start">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div> */}

                    {
                       comments.map( comment => 
                            parseInt( comment.user_id) == userid ? 
                            <p>
                                <div className="chat chat-end">
                                    <div className="chat-header">
                                        {comment.name + " " + comment.last_name} 
                                    </div>

                                    <div className="chat-bubble">
                                        {comment.text}
                                    </div>
                                </div>
                            </p> 
                                : 
                            <p>
                                <div className="chat chat-start">

                                    <div className="chat-header">
                                        {comment.name + " " + comment.last_name} 
                                    </div>

                                    <div className="chat-bubble">
                                        {comment.text}
                                    </div>
                                </div>
                            </p>
                            
                        )
                    }



                </div>

                <div className='form-component'>
                    <input type="text" placeholder="Type here" className="input" onChange={e => setCommentMessage(e.target.value)}/>
                    <button type='button' className="btn btn-primary" onClick={handleCreateComment}>Send Message</button>
                </div>



            </form>
        
        </>
    )
}

export default TicketInfo