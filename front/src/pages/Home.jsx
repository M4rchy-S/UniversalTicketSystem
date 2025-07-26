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

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [files, setFiles] = useState([]);

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
            document.getElementById('create-ticket-modal').close();
        })
        .catch(err => {
            console.log(err);
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
                                ? <div key={index} role="tab" className="tab tab-active"><h4>{title}</h4></div>
                                : <div key={index} role="tab" className="tab" onClick={e => { setStatus(index-1); setPage(1)}}><h4>{title}</h4></div>
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
                            {/* <th>Assigned agent</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {
                            tickets.map( ticket => 
                                <tr key={ticket.id} onClick={e => InfoTicketClick(ticket.id)}>
                                    <td>{ticket.id}</td>
                                    <td>{ticket.title}</td>
                                    <td> 
                                        {
                                            ticket.status == 0 &&
                                            <div className="badge badge-success">Open</div>
                                        }
                                        {
                                            ticket.status == 1 &&
                                            <div className="badge badge-warning">In Progress</div>
                                        }
                                        {
                                            ticket.status == 2 &&
                                            <div className="badge badge-error">Closed</div>
                                        }
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

                    <h4>Create ticket</h4>
                    <div className="modal-form">

                        <div className='modal-component'>
                            <label htmlFor="">Subject</label>
                            <input type="text" placeholder="Type here" className="input" onChange={e => setTitle(e.target.value)}/>
                        </div>

                        <div className='modal-component'>
                            <label htmlFor="">Message</label>
                            <textarea className="textarea text-no-resize" placeholder="Bio" onChange={e => setDescription(e.target.value)}></textarea>
                        </div>

                        <input className="file-input" type="file" multiple onChange={event => setFiles(event.target.files)} accept='image/*'/>

                        <button className="btn btn-primary" onClick={ handle_create_ticket }>
                            Create
                        </button>

                    </div>
                </div>
            </dialog>

        </>
    )
};

export default Home