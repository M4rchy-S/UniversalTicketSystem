import React from 'react';
import './pages.css'; 
import {Link} from 'react-router';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { useState } from 'react';

const Login = ({setLogin}) =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = (event) =>
    {
        event.preventDefault();
        axios.post("http://localhost:3000/api/user-login", {
            email: email,
            password: password
        })
        .then((response) => {
            console.log(response);
            setLogin(true);
            navigate("/");
        })
        .catch( (error) => {
            console.log(error);
        });
    }

    return(
        <>
            <div className='central-panel'>


                <h1 className="form-header">
                    Log in to your account
                </h1>

                <p className="danger-text">
                    Enter a valid email address
                </p>

                <form action="" className='forms-html' onSubmit={handleLogin}>
                    <div className='form-component'>
                        <label htmlFor="">Your email</label>
                        <input  type="text" placeholder="Type here" className="input main_input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your password</label>
                        <input  type="password" placeholder="Type here" className="input main_input" onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="right-helper">
                        <a className='link'>
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="btn btn-primary big_button">
                        Log in
                    </button>

                    <div>
                        Don't have an account?<span> </span>
                        <Link  to='/register' role="tab" className="link">
                            Sign Up
                        </Link>
                    </div>

                </form>

            </div>
        </>
    )
}

export default Login