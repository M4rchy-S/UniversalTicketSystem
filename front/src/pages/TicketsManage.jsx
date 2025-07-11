import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';


const TicketsManage = () =>{
    const navigate = useNavigate();

    function InfoTicketClick(id)
    {
        navigate(`/ticket/${id}`);
    }

    const tickets = [
        {
            id: 1,
            title: "Title1",
            status: "Ok",
            name: "name",
            last_name: "last_name"
        }, 
        {
            id: 2,
            title: "Title2",
            status: "Bad",
            name: "name",
            last_name: "last_name"
        }
    ];

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
                        <th>Name</th>
                        <th>Last Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {
                        tickets.map( ticket => 
                            <tr className="hover:bg-base-300" onClick={e => InfoTicketClick(ticket.id)}>
                                <th>{ticket.id}</th>
                                <td>{ticket.title}</td>
                                <td> <div className="badge badge-success">{ticket.status}</div> </td>
                                <td>{ticket.name}</td>
                                <td>{ticket.last_name}</td>
                            </tr>)
                    }

                    </tbody>
                </table>
            </div>
            

        </>
    )
};

export default TicketsManage