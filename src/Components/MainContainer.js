import React, { useContext, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import ChatArea from './ChatArea'
import WelcomeArea from './WelcomeArea'
import Creategroup from './Creategroup'
import Login from './Login'
import OnlineUsers from './OnlineUsers'
import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import ContextProvider, { globalContext } from '../Contex/ContextProvider'
import io from 'socket.io-client';
import { getBaseUrlForServer, getLoggedUser } from './misc/utili'
// const ENDPOINT = "http://localhost:4000"  //dev
const ENDPOINT = getBaseUrlForServer();
var socket;

function MainContainer() {
  const [socketconnected, setsocketconnected] = useState(false)
  const { refresh, setrefresh, notifications, setNotifications, newMessage, setNewMessage } = useContext(globalContext);
  const dy = useParams();
  var user = getLoggedUser();
  const chat_id = dy.id;

  console.log('====================================');
  console.log("chat id from MainContainer", chat_id);
  console.log('====================================');

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

  useEffect(() => {
    console.log("MAIN MOUNT")
    socket?.on('message recieved', (newmsg) => {
      console.log("Message received in  main container :", newmsg)
      console.log("Chat id now : ", chat_id);
      if (!chat_id || chat_id != newmsg.chat._id) {
        console.log("put in notification ");
        setNotifications((prevNotifs) =>
                [
                  ...prevNotifs,
                  newmsg.chat._id
                ]
              )
      } else {
        setNewMessage((state) => newmsg)
      }

          setrefresh((state) => !state);

    })
    return () => {
      socket?.off('message recieved')
      console.log('MAIN UNMOUNT')
    }
  }, [socket,chat_id]);


  // useEffect(() => {
  //   console.log("MAINCONTAINER MOUNTED")
  //   socket?.on("message recieved", (newMessageRecieved) => {
  //     console.log('on message received : ', newMessageRecieved, "chatID :  ", chat_id);
  //     if (
  //       // !selectedChatCompare || // if chat is not selected or doesn't match current chat
  //       chat_id !== newMessageRecieved.chat._id || !chat_id
  //     ) {
  //       console.log("Notification : ", newMessageRecieved);
  //       setNotifications((prevNotifs) =>
  //         [
  //           ...prevNotifs,
  //           newMessageRecieved.chat._id
  //         ]
  //       )

  //     } else {
  //       // setAllMessages((state) =>
  //       //   [
  //       //     ...state,

  //       //     newMessageRecieved

  //       //   ]

  //       // )
  //       setNewMessage((state) => newMessageRecieved)
  //     }

  //     console.log("msg from socket in MAIN CONTAINER: ", newMessageRecieved);
  //     setrefresh((state) => !state);
  //   });


  //   return () => {
  //     socket?.off('message received');
  //     console.log("MAIN CONTAINER UNMOUNTED");
  //   };

  // }, [socket, refresh, notifications, chat_id]);

  return (

    <div className='MainContainer'>
      {/* <ContextProvider> */}
      <Sidebar socket={socket} socketconnected={socketconnected} />
      {/* <ChatArea /> */}
      {/* <WelcomeArea /> */}
      {/* <Creategroup /> */}
      {/* <Login /> */}
      {/* <OnlineUsers /> */}
      <Outlet context={[socket, socketconnected]} />
      {/* </ContextProvider> */}

    </div>
  )
}

export default MainContainer