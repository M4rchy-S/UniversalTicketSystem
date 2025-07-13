import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () =>{
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(null);
    const [loading, setLoading] = useState(true);

    function CreateTicketButton()
    {
        navigate('/create-ticket');
    }

    function InfoTicketClick(id)
    {
        navigate(`/ticket/${id}`);
    }

    useEffect(() => {

        axios.get("http://localhost:3000/api/tickets")
        .then((response) => {
            console.log(response);
            setLoading(false);
            setTickets(response.data);
        })
        .catch( (error) => {
            console.log(error);
            setLoading(false);
        });

    }, [])

   

    if(loading)
        return( 
            <>
                <span className="loading loading-dots loading-xl"></span>
            </>
        )

    return(
        <>
            
            <h2 className='title'>
                Your tickets
            </h2>

            <div className="overflow-x-auto tickets-table">
                <table className="table">
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
                            <tr key={ticket.id} className="hover:bg-base-300" onClick={e => InfoTicketClick(ticket.id)}>
                                <th>{ticket.id}</th>
                                <td>{ticket.title}</td>
                                <td> <div className="badge badge-success">{ticket.status}</div> </td>
                            </tr>)
                    }

                    </tbody>
                </table>
            </div>
            
            
            <button className="btn btn-primary" onClick={CreateTicketButton}>
                Create ticket
            </button>
            

        </>
    )
};

export default Home