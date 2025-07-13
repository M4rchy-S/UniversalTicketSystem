import React, { useState } from 'react';
import './login.css'; 
import {Link} from 'react-router';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Register = ({setLogin}) =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");

    const handleRegister = (event) =>
    {
        event.preventDefault();
        axios.post("http://localhost:3000/api/create-user", {
            email: email,
            password: password,
            name: name,
            last_name: last_name
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
                <Link to='/login' role="tab" className="tab">Login</Link>
                <Link to='/register' role="tab" className="tab tab-active">Register</Link>
                </div>

                <form action="" className='forms-html' onSubmit={handleRegister}>
                    <div className='form-component'>
                        <label htmlFor="">Your email</label>
                        <input type="text" placeholder="Type here" className="input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your password</label>
                        <input type="password" placeholder="Type here" className="input" onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your Name</label>
                        <input type="text" placeholder="Type here" className="input" onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your Last Name</label>
                        <input type="text" placeholder="Type here" className="input" onChange={(e) => setLastName(e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Register account
                    </button>

                </form>

            </div>
        </>
    )
}

export default Register