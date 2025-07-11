import React from 'react';
import './login.css'; 
import {Link} from 'react-router';

const Login = () =>{
    return(
        <>
            <div className='central-panel'>

                <div role="tablist" className="tabs tabs-border">
                    <Link to='/login' role="tab" className="tab tab-active">Login</Link>
                    <Link to='/register' role="tab" className="tab">Register</Link>
                </div>

                <form action="" className='forms-html'>
                    <div className='form-component'>
                        <label htmlFor="">Your email</label>
                        <input type="text" placeholder="Type here" className="input" />
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your password</label>
                        <input type="text" placeholder="Type here" className="input" />
                    </div>

                    <button className="btn btn-primary">
                        Login
                    </button>

                </form>

            </div>
        </>
    )
}

export default Login