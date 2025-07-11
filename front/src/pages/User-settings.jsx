import React from 'react';

const UserSettings = () =>{
    return(
        <>

        <h2 className='title'>Account Settings</h2>

        <h3>Account information</h3>


        <p>Name: Name</p>
        <p>Last name: surname</p>
        <p>email: alex@mail.com</p>
        <p>Role: admin</p>


        <h3>Change password</h3>

        <form action="" className='forms-html'>
            <div className='form-component'>
                <label htmlFor="">Current password</label>
                <input type="text" placeholder="Type here" className="input" />
            </div>

            <div className='form-component'>
                <label htmlFor="">New Password</label>
                <input type="text" placeholder="Type here" className="input" />
            </div>
            
            <div className='form-component'>
                <label htmlFor="">Repeat new password</label>
                <input type="text" placeholder="Type here" className="input" />
            </div>
           

            <button className="btn btn-primary">
                Update password
            </button>

        </form>


    
        </>
    )
}

export default UserSettings