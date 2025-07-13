import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';

const AgentLists = () =>{
    const navigate = useNavigate();
    const [agents, setAgents] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleChangeRole = (id, newRole) =>
    {
        
        axios.put("http://localhost:3000/api/change-role", {
            user_id: id,
            role: newRole
        })
        .then((response) => {
            console.log(`ID: ${id} to new role: ${newRole}`);
            alert("Success");
        })
        .catch((error) => {
            console.log(error);
        })
    };

    useEffect(() => {
        axios.get("http://localhost:3000/api/users")
        .then((response) => {
    
            console.log(response.data);
    
            setAgents(response.data);
            
            setLoading(false);
    
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }, []);

    if(loading)
        return(<span className="loading loading-spinner loading-xl"></span>)

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
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {
                        agents.map( (agent, index) => 
                            <tr key={agent.id} className="hover:bg-base-300">
                                <th>{index + 1}</th>
                                <td>{agent.name}</td>
                                <td>{agent.last_name}</td>
                                <td>{agent.email}</td>
                                <td>
                                    <select defaultValue={agent.role} className="select select-primary selection-menu" onChange={(e) => handleChangeRole(agent.id, e.target.value)}>
                                        <option value='user'>User</option>
                                        <option value='agent'>Agent</option>
                                    </select>
                                </td>
                            </tr>)
                    }

                    </tbody>
                </table>
            </div>
            

        </>
    )
};

export default AgentLists