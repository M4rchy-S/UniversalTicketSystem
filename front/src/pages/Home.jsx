import React from 'react';
import './pages.css';
import {useNavigate} from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import SwitchPage from '../components/SwichPage';
import SwitchStatus from '../components/SwitchStatus';
import { useTranslation } from 'react-i18next';
import SmartBadge from '../components/SmartBadge';


const Home = () =>{
    const navigate = useNavigate();
    const [tickets, setTickets] = useState(null);

    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [status, setStatus] = useState(-1);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [files, setFiles] = useState([]);

    const {t} = useTranslation();

    const [isdanger, setIsdanger] = useState(false);
    const [dangertext, setDangertext] = useState("");

    function InfoTicketClick(id)
    {
        navigate(`/ticket/${id}`);
    }

    function update_tickets_list()
    {
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
    }

    function handle_create_ticket()
    {

        const url = "http://localhost:3000/api/ticket-create";
        const formData = new FormData();
        
        formData.append('title', title);
        formData.append('description', description);

        [...files].forEach((file, index) => {
            formData.append(`image`, file);
        });

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };

        axios.post(url, formData, config)
        .then(response => {
            console.log(response.data);
            setPage(1);
            setStatus(-1);
            update_tickets_list();
            setIsdanger(false);
            document.getElementById('create-ticket-modal').close();
        })
        .catch(err => {
            console.log(err);
            setIsdanger(true);
            setDangertext(err.response.data.errors[0].msg);
        })
    }

    useEffect(() => {
       update_tickets_list();
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
                    {t('Your tickets')}
                </h2>
                <button type="submit" className="btn btn-primary btn-style" onClick={()=>document.getElementById('create-ticket-modal').showModal()}>
                    {t('Create ticket')}
                </button>
            </div>

            <div className="divider"></div>

            <div className='home-filters'>
                
                <SwitchStatus setPage={setPage} status={status} setStatus={setStatus}/>

                <SwitchPage page={page} setPage={setPage} />
               
            </div>

            <div className="overflow-x-auto tickets-table home-table-content">
                <table className="table ">
                    <thead>
                        <tr>
                            <th>
                                №
                            </th>
                            <th>
                                {t('Title')}
                            </th>
                            <th>
                                {t('Status')}
                            </th>
                            {/* <th>Assigned agent</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {
                            tickets.map( ticket => 
                                <tr key={ticket.id} onClick={e => InfoTicketClick(ticket.id)}>
                                    <td>
                                        {ticket.id}
                                    </td>
                                    <td>
                                        <p className='truncate-text'>
                                            {ticket.title}
                                        </p>
                                    </td>
                                    <td> 
                                        <SmartBadge status={ticket.status} />
                                    </td>
                                    {/* <td>agent name</td> */}
                                </tr>)
                        }
                    </tbody>
                </table>
            </div>
            
            <dialog id="create-ticket-modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h4>
                        {t('Create ticket')}
                    </h4>
                    <div className="modal-form">

                        <div className='modal-component'>
                            <label htmlFor="">
                                {t('Subject')}
                            </label>
                            <input type="text" placeholder="Type here" className="input" onChange={e => setTitle(e.target.value)}/>
                        </div>

                        <div className='modal-component'>
                            <label htmlFor="">
                                {t('Message')}
                            </label>
                            <textarea className="textarea text-no-resize" placeholder="Bio" onChange={e => setDescription(e.target.value)}></textarea>
                        </div>

                        <input className="file-input" type="file" multiple onChange={event => setFiles(event.target.files)} accept='image/*'/>

                        {
                            isdanger &&
                            <>
                                <p className="danger-text">
                                    {dangertext}
                                </p>
                            </>
                        }

                        <button className="btn btn-primary" onClick={ handle_create_ticket }>
                            {t('Create')}
                        </button>

                    </div>
                </div>
            </dialog>

        </>
    )
};

export default Home