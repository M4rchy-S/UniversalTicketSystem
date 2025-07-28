import React from 'react';
import './pages.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import SwitchPage from '../components/SwichPage';
import { useTranslation } from 'react-i18next';

const AgentLists = () =>{
    const [agents, setAgents] = useState(null);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);

    const {t} = useTranslation();

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
        axios.get(`http://localhost:3000/api/users?page=${page}`)
        .then((response) => {
    
            console.log(response.data);
    
            setAgents(response.data);
            
            setLoading(false);
    
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        })
    }, [page]);

    if(loading)
        return(<span className="loading loading-spinner loading-xl"></span>)

    return(
        <>
            
            <div className='home-title'>
                <h2>
                    {t('User administration')}
                </h2>
               
            </div>

            <div className="divider"></div>

            <div className='home-filters'>

                <div>

                </div>
                
                <SwitchPage page={page} setPage={setPage} />
               
            </div>

            <div className="overflow-x-auto tickets-table">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>
                            {t('Name')}
                        </th>
                        <th>
                           {t('Last Name')}
                        </th>
                        <th>
                            {t('Email')}
                        </th>
                        <th>
                            {t('Role')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {
                        agents.map( (agent, index) => 
                            <tr key={agent.id} className="hover:bg-base-300">
                                <td>{index + 1}</td>
                                <td>{agent.name}</td>
                                <td>{agent.last_name}</td>
                                <td>{agent.email}</td>
                                <td>
                                    <select defaultValue={agent.role} className="select select-primary selection-menu" onChange={(e) => handleChangeRole(agent.id, e.target.value)}>
                                        <option value='user'>
                                            {t('User')}
                                        </option>
                                        <option value='agent'>
                                            {t('Agent')}
                                        </option>
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