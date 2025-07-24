import './App.css';

import {  Routes, Route } from "react-router";

import Home from "./pages/Home";

import Login from "./pages/Login";
import Register from "./pages/Register";

import UserSettings from "./pages/User-settings";
import TicketCreate from "./pages/TicketCreate.jsx";
import TicketInfo from "./pages/TicketInfo.jsx";

import Menu from "./components/Menu.jsx";
import Navbar from "./components/Navbar.jsx";

import TicketsManage from "./pages/TicketsManage.jsx";
import AgentsLists from "./pages/AgentLists.jsx";

import axios from "axios";

axios.defaults.withCredentials = true; 

import {useState, useEffect} from 'react';


function App() {
  const [login, setLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [role, setRole] = useState("");
  const [userid, setUserid] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");


  useEffect(() => {
    axios.get("http://localhost:3000/api/user-info")
    .then((response) => {
      setLogin(true);
      setLoading(false);


      setRole(response.data.role);
      setUserid(response.data.id);
      setName(response.data.name);
      setLastname(response.data.last_name);


    })
    .catch((error) => {
      setLoading(false);
      setLogin(false);
    })
  }, [login]);


  if(loading)
    return(
      <>
        <span className="loading loading-spinner loading-xl center-loading"></span>
      </>
    )

  if(!login)
    return(
      <>
        <Routes>
          <Route path='/' element={<Login setLogin={setLogin} />} />
          <Route path='/login' element={<Login setLogin={setLogin}/>} />
          <Route path='/register' element={<Register setLogin={setLogin}/>} />

        </Routes>
      </>
    )

  return (
    <>
      
      <div className='main-container'>

        <div className='left-panel'>
          <Menu setLogin={setLogin} role={role}/>
        </div>

        <div className='right-panel'>

          <div className='body-container'>
            <Routes>
              <Route path="/" element={<Home/>} />

              <Route path="/user-settings" element={<UserSettings/>} />

              <Route path="/tickets" element={<Home/>} />
              <Route path="/create-ticket" element={<TicketCreate/>} />
              <Route path="/ticket/:ticketId" element={<TicketInfo userid={userid} name={name} lastname={lastname} role={role}/>} />


              {role === "agent" || role === "admin" ? 
                (
                  <Route path="/manage/tickets" element={<TicketsManage/>}/>
                ) : (<></>)
              }

              {role === "admin" ? 
                (
                  <Route path="/manage/agents" element={<AgentsLists/>}/>
                ) : (<></>)
              }


            </Routes>
          </div>

        </div>

      </div>

    </>
  )
}

export default App
