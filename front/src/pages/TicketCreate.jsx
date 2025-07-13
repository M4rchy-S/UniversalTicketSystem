import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const TicketCreate = () =>{
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    
    const handleCreateTicket = (e) =>{
        e.preventDefault();

        axios.post("http://localhost:3000/api/ticket-create", {
            title: title,
            description: description
        })
        .then((response) => {
            console.log(response.data);
            navigate(`/ticket/${response.data.id}`);
    
        })
        .catch((error) => {
            console.log(error);
        })

    };


    return(
        <>
            <h2 className='title'>Ticket Creation</h2>

            <form action="" className='forms-html' onSubmit={handleCreateTicket}>
                <div className='form-component'>
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Type here" className="input"  onChange={e => setTitle(e.target.value)}/>
                </div>
                
                <div className='form-component'>
                    <label htmlFor="">Description</label>
                    <textarea className="textarea" placeholder="Bio" onChange={e => setDescription(e.target.value)}>

                    </textarea>
                </div>

                <button className="btn btn-primary">
                    Create Ticket
                </button>

            </form>
        
        </>
    )
}

export default TicketCreate