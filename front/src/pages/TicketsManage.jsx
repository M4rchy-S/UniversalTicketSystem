import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';


const TicketsManage = () =>{
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    function InfoTicketClick(id)
    {
        navigate(`/ticket/${id}`);
    }

    function handleChangeStatus(id, status)
    {
        console.log(`Id: ${id} with status ${status}`);

        axios.put("http://localhost:3000/api/ticket-update-status",{
            ticket_id: id,
            new_status: status
        })
        .then((response) => {
    
            console.log(response.data);
            alert("success");
    
        })
        .catch((error) => {
            console.log(error);
        })

    }

    function handleDeleteTicket(id)
    {
        axios.delete(`http://localhost:3000/api/ticket-delete?ticket_id=${id}`)
        .then((response) => {
    
            console.log(response.data);
            alert("success");
            
            const temp = [...tickets];
            
            for(let i = 0; i < temp.length; i++)
            {
                if(temp[i].id == id)
                {
                    delete temp[i];
                    break;
                }
            }

            setTickets(temp);

        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        axios.get("http://localhost:3000/api/tickets-all")
        .then((response) => {
    
            console.log(response.data);
    
            setTickets(response.data);
            setLoading(false);
    
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, [tickets]);

    

    if(loading)
        return(<span className="loading loading-dots loading-xl"></span>)

    return(
        <>
            
            <h2 className='title'>
                Tickets Manager
            </h2>

            <div className="overflow-x-auto tickets-table">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Title</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {
                        tickets.map( ticket => 
                            <tr key={ticket.id} className="hover:bg-base-300">
                                <th>{ticket.id}</th>
                                <td className='clickable' onClick={e => InfoTicketClick(ticket.id)}>{ticket.title}</td>
                                <td> 
                                    <select defaultValue={ticket.status} className="select select-primary selection-menu" onChange={e => { handleChangeStatus(ticket.id, e.target.value);}}>
                                        <option value='0'>Opened</option>
                                        <option value='1'>In Progress</option>
                                        <option value='2'>Closed</option>
                                    </select>
                                </td>
                                <td >
                                    <button className="btn btn-error del-btn" onClick={e => handleDeleteTicket(ticket.id)}>Delete</button>
                                </td>
                            </tr>)
                    }

                    </tbody>
                </table>
            </div>
            

        </>
    )
};

export default TicketsManage