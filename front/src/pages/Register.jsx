import React, { useState } from 'react';
import './pages.css'; 
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


                <h1 className="form-header">
                    Create an account
                </h1>

                <p className="danger-text">
                    An account with this email already exists.
                    Sign in instead.
                </p>

                <form action="" className='forms-html' onSubmit={handleRegister}>
                    <div className='form-component'>
                        <label htmlFor="">Your email</label>
                        <input type="text" placeholder="Type here" className="input main_input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your password</label>
                        <input type="password" placeholder="Type here" className="input main_input" onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <p className="hint-text">
                        Use at least 8 characters, including 1 number and 1 special character (e.g., ! @ # $ % & ).
                    </p>

                    <div className='form-component'>
                        <label htmlFor="">Your Name</label>
                        <input type="text" placeholder="Type here" className="input main_input" onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">Your Last Name</label>
                        <input type="text" placeholder="Type here" className="input main_input" onChange={(e) => setLastName(e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-primary big_button">
                        Register account
                    </button>

                    <div>
                        Already have an account? <span> </span>
                        <Link to='/login' role="tab" className="link">Log in</Link>
                    </div>

                </form>

            </div>
        </>
    )
}

export default Register