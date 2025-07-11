import React from 'react';

const TicketCreate = () =>{
    return(
        <>
            <h2 className='title'>Ticket Creation</h2>

            <form action="" className='forms-html'>
                <div className='form-component'>
                    <label htmlFor="">Title</label>
                    <input type="text" placeholder="Type here" className="input" />
                </div>
                
                <div className='form-component'>
                    <label htmlFor="">Description</label>
                    <textarea className="textarea" placeholder="Bio"></textarea>
                </div>

                <button className="btn btn-primary">
                    Create Ticket
                </button>

            </form>
        
        </>
    )
}

export default TicketCreate