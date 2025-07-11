import React from 'react';
import { useParams } from 'react-router';

const TicketInfo = () =>{
    let {ticketId} = useParams();

    return(
        <>
            <h2 className='title'>Ticket Information</h2>

            <form action="" className='forms-html'>
                <div className='form-component'>
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Type here" className="input" />
                </div>
                
                <div className='form-component'>
                    <label htmlFor="">Description</label>
                    <textarea className="textarea" placeholder="Bio"></textarea>
                </div>

                <label htmlFor="">Support Chat</label>
                <div className='form-component chat-component'>
                    <div className="chat chat-start">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">You were the Chosen One!</div>
                    </div>

                    <div className="chat chat-start">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div>

                    <div className="chat chat-end">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div>
                    <div className="chat chat-end">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div>
                    <div className="chat chat-end">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div>
                    <div className="chat chat-end">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div>
                    <div className="chat chat-end">
                        <div className="chat-header">
                            Obi-Wan Kenobi
                        </div>
                        <div className="chat-bubble">I loved you.</div>
                    </div>
                </div>

                <div className='form-component'>
                    <input type="text" placeholder="Type here" className="input" />
                    <button class="btn btn-primary">Send Message</button>
                </div>



            </form>
        
        </>
    )
}

export default TicketInfo