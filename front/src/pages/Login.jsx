import React from 'react';
import './pages.css'; 
import {Link} from 'react-router';
import axios from 'axios';
import { useNavigate } from 'react-router';

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

const Login = ({setLogin}) =>{
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [danger, setDanger] = useState(false);
    const [dangerText, setDangerText] = useState("");

    const [loading, setLoading] = useState(false);

    const {t} = useTranslation();


    const handleLogin = (event) =>
    {
        event.preventDefault();

        setLoading(true);

        axios.post("http://localhost:3000/api/user-login", {
            email: email,
            password: password
        })
        .then((response) => {
            setLoading(false);
            setLogin(true);
            navigate("/");
        })
        .catch( (error) => {

            const errors = error.response.data.errors;
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
                    { t('Log in to your account') }
                </h1>

                {
                    danger && 
                        <p className="danger-text">
                            {dangerText}
                        </p>
                }

                <form action="" className='forms-html' onSubmit={handleLogin}>
                    <div className='form-component'>
                        <label htmlFor="">{ t('Your email') }</label>
                        <input  type="text" placeholder="Type here" className="input main_input" onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <div className='form-component'>
                        <label htmlFor="">{ t('Your password') }</label>
                        <input  type="password" placeholder="Type here" className="input main_input" onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    
                    <div className="right-helper">
                        <a className='link'>
                            { t('Forgot password?') }
                        </a>
                    </div>

                    <button type="submit" className="btn btn-primary big_button">
                        { t('Log in') }
                    </button>

                    <div>
                        { t('Don\'t have an account?') }<span> </span>
                        <Link  to='/register' role="tab" className="link">
                            { t('Sign Up') }
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

export default Login