import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';


const Home = () =>{
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(null);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState(-1);
    const [statusNames, setStatusNames] = useState(['All', 'Open', 'In Progress', 'Closed']);

    function CreateTicketButton()
    {
        navigate('/create-ticket');
    }

    function InfoTicketClick(id)
    {
        navigate(`/ticket/${id}`);
    }

    function LeftClickPage()
    {
        if(page == 1)
            return;
        setPage(page => page - 1);
    }

    function RightClickPage()
    {
        setPage(page => page + 1);
    }

    useEffect(() => {

        axios.get(`http://localhost:3000/api/tickets?status=${status}&page=${page}`)
        .then((response) => {
            console.log(response);
            setLoading(false);
            setTickets(response.data);
        })
        .catch( (error) => {
            console.log(error);
            setLoading(false);
        });

    }, [page, status])

   

    if(loading)
        return( 
            <>
                <span className="loading loading-dots loading-xl"></span>
            </>
        )

    return(
        <>

            <div className='home-title'>
                <h2>
                    Your tickets   
                </h2>
                <button type="submit" className="btn btn-primary btn-style" onClick={()=>document.getElementById('create-ticket-modal').showModal()}>
                    Create ticket
                </button>
            </div>

            <div className="divider"></div>

            <div className='home-filters'>
                <div role="tablist" className="tabs tabs-lift filters">
                    {
                        statusNames.map( ( title, index) => 
                            index - 1 == status 
                                ? <div role="tab" className="tab tab-active"><h4>{title}</h4></div>
                                : <div role="tab" className="tab" onClick={e => { setStatus(index-1); setPage(1)}}><h4>{title}</h4></div>
                        )
                    }
                </div>

                <div className="join pagination">
                    <button className="join-item btn" onClick={e => LeftClickPage()}>«</button>
                    <button className="join-item btn page-button">Page {page}</button>
                    <button className="join-item btn" onClick={e => RightClickPage()}>»</button>
                </div>
            </div>

            <div className="overflow-x-auto tickets-table home-table-content">
                <table className="table ">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Assigned agent</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            tickets.map( ticket => 
                                <tr key={ticket.id} onClick={e => InfoTicketClick(ticket.id)}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.title}</td>
                                    <td> <div className="badge badge-success">{ticket.status} success</div> </td>
                                    <td>agent name</td>
                                </tr>)
                        }
                    </tbody>
                </table>
            </div>
            
            
            <button className="btn btn-primary" onClick={CreateTicketButton}>
                Create ticket
            </button>
            
            <dialog id="create-ticket-modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>


                    <p>Create ticket</p>
                    <div className="modal-form">

                        <div className='modal-component'>
                            <label htmlFor="">Subject</label>
                            <input type="text" placeholder="Type here" className="input" />
                        </div>

                        <div className='modal-component'>
                            <label htmlFor="">Message</label>
                            <textarea className="textarea" placeholder="Bio"></textarea>
                        </div>

                        <button className="btn btn-primary" onClick={()=>document.getElementById('create-ticket-modal').close()}>
                            Create
                        </button>

                    </div>
                </div>
            </dialog>

        </>
    )
};

export default Home