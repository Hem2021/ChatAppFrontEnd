import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import WelcomeArea from './WelcomeArea'
import Creategroup from './Creategroup'
import Login from './Login'
import OnlineUsers from './OnlineUsers'
import { Outlet, useOutletContext } from 'react-router-dom'
import ContextProvider, { globalContext } from '../Contex/ContextProvider'
import io from 'socket.io-client';
import { getLoggedUser } from './misc/utili'
// const ENDPOINT = "http://localhost:4000"  //dev
const ENDPOINT = "https://chatapp-api.onrender.com"
var socket;

function MainContainer() {
  const [socketconnected, setsocketconnected] = useState(false)
  var user = getLoggedUser();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setsocketconnected(!socketconnected);
    })

    return () => {
      socket.off('connected');

    }
  }, []);

  console.log('====================================');
  console.log("socket status : ", socketconnected);
  console.log('====================================');
  return (

    <div className='MainContainer'>
      <ContextProvider>
        <Sidebar />
        {/* <ChatArea /> */}
        {/* <WelcomeArea /> */}
        {/* <Creategroup /> */}
        {/* <Login /> */}
        {/* <OnlineUsers /> */}
        <Outlet context={[socket, socketconnected]} />
      </ContextProvider>

    </div>
  )
}

export default MainContainer