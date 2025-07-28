import React, { useState } from 'react';
import './pages.css'; 
import {Link} from 'react-router';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { useTranslation } from 'react-i18next';

const Register = ({setLogin}) =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rep_password, setRepPassword] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");

    const [danger, setDanger] = useState(false);
    const [dangerText, setDangerText] = useState("");

    const [loading, setLoading] = useState(false);

    const {t} = useTranslation();

    const handleRegister = (event) =>
    {
        event.preventDefault();

        setLoading(true);

        axios.post("http://localhost:3000/api/create-user", {
            email: email,
            password: password,
            rep_password: rep_password,
            name: name,
            last_name: last_name
        })
        .then((response) => {
            setLoading(false);
            setLogin(true);
            navigate("/");
        })
        .catch( (error) => {
            const errors = error.response.data.errors;
            console.log(errors);
            if(Array.isArray(errors))
                setDangerText(errors[0].msg);
            else
                setDangerText(errors);

            setDanger(true);
            setLoading(false);
        });
    }

    return(
        <>
            <div className='central-panel'>


                <h1 className="form-header">
                    { t('Create an account') }
                </h1>

                {
                    danger &&
                        <p className="danger-text">
                            {dangerText}
                            {/* An account with this email already exists.
                            Sign in instead. */}
                        </p>
                }

                <form action="" className='forms-html' onSubmit={handleRegister}>
                    <div className='form-component'>
                        <label htmlFor="">
                            { t('Your email') }
                        </label>
                        <input type="text" placeholder="Type here" className="input main_input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">
                            {t('Your password')}
                        </label>
                        <input type="password" placeholder="Type here" className="input main_input" onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">
                            {t('Repeat your password')}
                        </label>
                        <input type="password" placeholder="Type here" className="input main_input" onChange={(e) => setRepPassword(e.target.value)}/>
                    </div>

                    <p className="hint-text">
                        {/* Use at least 8 characters, including 1 number and 1 special character (e.g., ! @ # $ % & ). */}
                        { t('Use at least 8 characters.') } 
                    </p>

                    <div className='form-component'>
                        <label htmlFor="">
                            { t('Your Name') }
                        </label>
                        <input type="text" placeholder="Type here" className="input main_input" onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">
                            { t('Your Last Name') }
                        </label>
                        <input type="text" placeholder="Type here" className="input main_input" onChange={(e) => setLastName(e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-primary big_button">
                        { t('Register account') }
                    </button>

                    <div>
                        { t('Already have an account?')} <span> </span>
                        <Link to='/login' role="tab" className="link">
                            { t('Log in') }
                        </Link>
                    </div>

                    {
                        loading && 
                            <span className="loading loading-spinner loading-xl"></span>
                    }

                </form>

            </div>
        </>
    )
}

export default Register