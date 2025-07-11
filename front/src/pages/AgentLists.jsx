import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';


const AgentLists = () =>{
    const navigate = useNavigate();

    const agents = [
        {
            id: 1,
            name: 'Name',
            last_name: 'Last_name'
        }, 
        {
            id: 2,
            name: 'Name',
            last_name: 'Last_name'
        }
    ];

    return(
        <>
            
            <h2 className='title'>
                Manage Agents
            </h2>

            <div className="overflow-x-auto tickets-table">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Name</th>
                        <th>Last Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {
                        agents.map( agent => 
                            <tr className="hover:bg-base-300" onClick={e => InfoTicketClick(ticket.id)}>
                                <th>{agent.id}</th>
                                <td>{agent.name}</td>
                                <td>{agent.last_name}</td>
                            </tr>)
                    }

                    </tbody>
                </table>
            </div>
            

        </>
    )
};

export default AgentLists