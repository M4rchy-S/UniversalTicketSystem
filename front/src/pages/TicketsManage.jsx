import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';
import axios from 'axios';
import { useState, useEffect } from 'react';
import SwitchPage from '../components/SwichPage';
import SwitchStatus from '../components/SwitchStatus';
import { useTranslation } from 'react-i18next';


const TicketsManage = () =>{
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    const [page, setPage] = useState(1)
    const [status, setStatus] = useState(-1);

    const {t} = useTranslation();

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
        axios.get(`http://localhost:3000/api/tickets-all?status=${status}&page=${page}`)
        .then((response) => {
    
            console.log(response.data);
    
            setTickets(response.data);
            setLoading(false);
    
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    }, [status, page]);

    

    if(loading)
        return(<span className="loading loading-dots loading-xl"></span>)

    return(
        <>
            
            <div className='home-title'>
                <h2>
                    {t('Tickets manager')}
                </h2>
               
            </div>

            <div className="divider"></div>

            <div className='home-filters'>
                
                <SwitchStatus setPage={setPage} status={status} setStatus={setStatus} />

                <SwitchPage page={page} setPage={setPage} />
               
            </div>

            <div className="overflow-x-auto tickets-table home-table-content">
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>
                            {t('Title')}
                        </th>
                        <th>
                            {t('Status')}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    
                    {
                        tickets.map( ticket => 
                            <tr key={ticket.id} className="hover:bg-base-300">
                                <td>{ticket.id}</td>
                                <td className='clickable' onClick={e => InfoTicketClick(ticket.id)}>{ticket.title}</td>
                                <td> 
                                    <select defaultValue={ticket.status} className="select select-primary selection-menu" onChange={e => { handleChangeStatus(ticket.id, e.target.value);}}>
                                        <option value='0'>
                                            {t('Opened')}
                                        </option>
                                        <option value='1'>
                                            {t('In Progress')}
                                        </option>
                                        <option value='2'>
                                            {t('Closed')}
                                        </option>
                                    </select>
                                </td>
                                <td >
                                    <button className="btn btn-error del-btn" onClick={e => handleDeleteTicket(ticket.id)}>
                                        {t('Delete')}
                                    </button>
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