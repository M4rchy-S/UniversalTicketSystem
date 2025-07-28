import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const UserSettings = ({setLogin}) =>{
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const [currectPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(true);
    const [danger, setDanger] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const [dangerPassword, setDangerPassword] = useState(false);
    const [loadingState1, setLoadingState1] = useState(false);

    const [language, setLanguage] = useState("");

    const {t, i18n} = useTranslation();

    const langs = [
        {
            native:"English",
            code: "en"
        },
        {
            native: "Русский",
            code: "ru"
        }
    ];

    useEffect(() => {
        axios.get("http://localhost:3000/api/user-info")
            .then((response) => {
                setName(response.data.name);
                setLastname(response.data.last_name);
                setEmail(response.data.email);
                setRole(response.data.role);

                setLoading(false);
                
                for(let i =0; i < langs.length; i++)
                {
                    if(langs[i].code === i18n.resolvedLanguage)
                    {
                        setLanguage(langs[i].native);
                        break;
                    }
                }

            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
    }, []);

    const handleChangePassword = (e) => {
        e.preventDefault();

        setLoadingState1(true);

        axios.put("http://localhost:3000/api/update/password", {
            old_password: currectPassword,
            new_password: newPassword
        })
        .then((response) => {
            console.log(response.data);
            setDangerPassword(false);
            setLoadingState1(false);
            document.getElementById('change-password-modal').close();
        })
        .catch((error) => {
            console.log(error);
            setDangerPassword(true);
            setLoadingState1(false);
        })

    };

    const handleChangeName = (e) => {
        e.preventDefault();

        axios.put("http://localhost:3000/api/update/names", {
            name: name,
            last_name: lastname
        }).then((response) => {

            console.log(response.data);
            setDanger(false);
            setSuccess(true);
        }).catch((error) => {
            setDanger(true);
            console.log(error);
        })

    };

    const deleteAccount = () => {

        axios.delete("http://localhost:3000/api/delete-account")
        .then((response) => {
            setLogin(false);
            navigate("/");
        }).catch((error) => {
            console.log(error);
        })

    }

    function changeLanguage(languageSelected)
    {
        for(let i = 0; i < langs.length; i++)
        {
            if(langs[i].native == languageSelected)
            {
                i18n.changeLanguage(langs[i].code);
                localStorage.setItem('lang', langs[i].code);
                break;
            }
        }
    }

    if(loading)
        return(
          <>
            <span className="loading loading-spinner loading-xl center-page"></span>
          </>
        )

    return (
        <>
            <div className='home-title'>
                <h2>
                    {t('Settings')}
                </h2>
            </div>

            <div className="divider"></div>

            <div className='settings-main-page'>

                <div className='settings-container'>

                    <h3>
                        {t('Profile details')}
                    </h3>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            {t('Name')}
                        </legend>
                        <input type="text" className="input" placeholder="Type here" value={name} onChange={e => setName(e.target.value)}/>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            {t('Last Name')}
                        </legend>
                        <input type="text" className="input" placeholder="Type here" value={lastname} onChange={e => setLastname(e.target.value)}/>
                    </fieldset>

                    <button className="btn btn-primary" onClick={handleChangeName}>
                        {t('Save changes')}
                    </button>
                    
                    {
                        danger &&
                            <p className='danger-text danger-small'>One of the field was invalid</p>

                    }

                    {
                        success &&
                            <p className='success-text-mini'>Data was updated successfully</p>
                    }

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            {t('Language')}
                        </legend>
                        <select defaultValue={language} className="select" onChange={e => changeLanguage(e.target.value)}>
                            {
                               langs.map(lang => 
                                    <option>{lang.native}</option>
                               )
                            }
                        </select>
                    </fieldset>

                </div>

                <div className='settings-container'>
                    <h3>
                        {t('Account Settings')}
                    </h3>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            {t('Email')}
                        </legend>
                        <p>
                            <i>
                                {email}
                            </i>
                        </p>
                    </fieldset>

                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            {t('Role')}
                        </legend>
                        <p>
                            <i>
                                {role}
                            </i>
                        </p>
                    </fieldset>

                    <button className="btn btn-soft btn-info" onClick={()=>document.getElementById('change-password-modal').showModal()}>
                        {t('Change password')}
                    </button>

                    <button className="btn btn-soft btn-error" onClick={()=>document.getElementById('delete-account-modal').showModal()}>
                        {t('Delete account')}
                    </button>
                </div>

            </div>

            <dialog id="change-password-modal" className="modal">
                <div className="modal-box ">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h4>Change password</h4>
                    <div className="modal-form">

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Current passsword</legend>
                            <input type="password" className="input" placeholder="Type here" value={currectPassword} onChange={e => setCurrentPassword(e.target.value)}/>
                        </fieldset>

                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">New password</legend>
                            <input type="password" className="input" placeholder="Type here" value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
                        </fieldset>

                        <button className="btn btn-primary" onClick={handleChangePassword}>Save password</button>

                        {
                            dangerPassword &&
                            <p className='danger-text danger-center'>Invalid passwords values</p>
                        }

                        {
                            loadingState1 &&
                            <span className="loading loading-spinner loading-xl danger-center"></span>
                        }

                    </div>
                </div>
            </dialog>
            <dialog id="delete-account-modal" className="modal">
                <div className="modal-box modal-stretch">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <h4>Are you sure you want to delete your account</h4>
                    <div className="modal-form deletion-form">

                        <button className="btn btn-outline btn-error" onClick={deleteAccount}>
                            Yes
                        </button>

                        <button className="btn btn-outline btn-success" onClick={()=>document.getElementById('delete-account-modal').close()}>
                            No
                        </button>

                    </div>
                </div>
            </dialog>

        </>
    )
}

export default UserSettings