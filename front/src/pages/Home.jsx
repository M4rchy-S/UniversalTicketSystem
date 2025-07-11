import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';


const Home = () =>{
    const navigate = useNavigate();

    function CreateTicketButton()
    {
        navigate('/create-ticket');
    }

    function InfoTicketClick(id)
    {
        navigate(`/ticket/${id}`);
    }

    const tickets = [
        {
            id: 1,
            title: "Title1",
            status: "Ok"
        }, 
        {
            id: 2,
            title: "Title2",
            status: "Bad"
        }
    ];

    return(
        <>
            
            <h2 className='title'>
                Your tickets
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
                            <tr className="hover:bg-base-300" onClick={e => InfoTicketClick(ticket.id)}>
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