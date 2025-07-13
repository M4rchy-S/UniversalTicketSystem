import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';


const UserSettings = () =>{
    
    const [name, setName] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const [currectPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [newName, setNewName] = useState("");
    const [newLastname, setNewLastName] = useState("");

    useEffect(() => {
        axios.get("http://localhost:3000/api/user-info")
        .then((response) => {
    
    
          setName(response.data.name);
          setLastname(response.data.last_name);
          setEmail(response.data.email);
          setRole(response.data.role);
    
        })
        .catch((error) => {
            console.log(error);
        })
      }, []);

    const handleChangePassword = (e) => {
        e.preventDefault();

        axios.put("http://localhost:3000/api/update/password", {
            old_password: currectPassword,
            new_password: newPassword
        })
        .then((response) => {
    
            console.log(response.data);

    
        })
        .catch((error) => {
            console.log(error);
        })

    };

    const handleChangeName = (e) => {
        e.preventDefault();

        axios.put("http://localhost:3000/api/update/names", {
            name: newName,
            last_name: newLastname
        })
        .then((response) => {
    
            console.log(response.data);
            setName(newName);
            setLastname(newLastname);

        })
        .catch((error) => {
            console.log(error);
        })

    };



    return(
        <>

        <h2 className='title'>Account Settings</h2>

        <h3>Account information</h3>


        <p>Name: {name}</p>
        <p>Last name: {lastname}</p>
        <p>email: {email}</p>
        <p>Role: {role}</p>


        <h3>Change password</h3>

        <form action="" className='forms-html' onSubmit={handleChangePassword}>
            <div className='form-component'>
                <label htmlFor="">Current password</label>
                <input type="text" placeholder="Type here" className="input" onChange={(e) => setCurrentPassword(e.target.value)}/>
            </div>

            <div className='form-component'>
                <label htmlFor="">New Password</label>
                <input type="text" placeholder="Type here" className="input" onChange={(e) => setNewPassword(e.target.value)}/>
            </div>
            
            <button type="submit" className="btn btn-primary">
                Update password
            </button>

        </form>

        <h3>Change name</h3>

        <form action="" className='forms-html' onSubmit={handleChangeName}>
            <div className='form-component'>
                <label htmlFor="">Current name</label>
                <input type="text" placeholder="Type here" className="input" onChange={(e) => setNewName(e.target.value)}/>
            </div>

            <div className='form-component'>
                <label htmlFor="">Current Last Name</label>
                <input type="text" placeholder="Type here" className="input" onChange={(e) => setNewLastName(e.target.value)}/>
            </div>
            
            <button type="submit" className="btn btn-primary">
                Update names
            </button>

        </form>


    
        </>
    )
}

export default UserSettings