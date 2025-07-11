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
  const [login, setLogin] = useState(true);

  if(!login)
    return(
      <>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />

        </Routes>
      </>
    )

  return (
    <>
      
      <div className='main-container'>

        <div className='left-panel'>
          <Menu/>
        </div>

        <div className='right-panel'>

          <div className="top-navbar">
            <Navbar/>
          </div>

          <div className='body-container'>
            <Routes>
              <Route path="/" element={<Home/>} />

              <Route path="/user-settings" element={<UserSettings/>} />

              <Route path="/tickets" element={<Home/>} />
              <Route path="/create-ticket" element={<TicketCreate/>} />
              <Route path="/ticket/:ticketId" element={<TicketInfo/>} />

              <Route path="/manage/tickets" element={<TicketsManage/>}/>
              <Route path="/manage/agents" element={<AgentsLists/>}/>

            </Routes>
          </div>

        </div>

      </div>

    </>
  )
}

export default App
