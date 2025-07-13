import React from 'react';
import './login.css'; 
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

                <div role="tablist" className="tabs tabs-border">
                    <Link to='/login' role="tab" className="tab tab-active">Login</Link>
                    <Link to='/register' role="tab" className="tab">Register</Link>
                </div>

                <form action="" className='forms-html' onSubmit={handleLogin}>
                    <div className='form-component'>
                        <label htmlFor="">Your email</label>
                        <input type="text" placeholder="Type here" className="input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your password</label>
                        <input type="password" placeholder="Type here" className="input" onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Login
                    </button>

                </form>

            </div>
        </>
    )
}

export default Login