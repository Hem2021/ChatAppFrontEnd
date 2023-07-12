import React, { useContext, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { Icon, IconButton, Skeleton } from '@mui/material';
import MessageOther from './MessageOther';
import MessageSelf from './MessageSelf';
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from 'react-redux';
import { globalContext } from '../Contex/ContextProvider';
import Profilepic from './Profilepic';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { getLoggedUser, getotheruserdetails } from './misc/utili';
import axios from 'axios';
import LoadSkeleton from './Loading/LoadSkeleton';
import ScrollableFeed from "react-scrollable-feed";
import AlertUser from './AlertUser';
import { ConstructionOutlined } from '@mui/icons-material';
import { Socket } from 'socket.io-client';
import Lottie from "lottie-react"
import typinganimation from "../animations/typing.json"

function ChatArea() {
    var [AllMessages, setAllMessages] = useState([]);
    var [AllMessagesCopy, setAllMessagesCopy] = useState([]);
    var [loading, setloading] = useState(true)
    const [messageContent, setmessageContent] = useState("")
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    console.log('Chat area fired 1!')
    const { refresh, setrefresh, notifications, setNotifications } = useContext(globalContext);
    var [socket, socketconnected] = useOutletContext();
    // console.log("fresh socket : ", socket)
    // console.log('Chat area fired 2!')
    const [alert, setAlert] = useState({
        active: false,
        cause: "",
        msg: ""
    })
    const dyParams = useParams();
    var lightTheme = useSelector((state) => { return state.lightTheme });
    const [socketConnectionStatus, setSocketConnectionStatus] = useState(false)
    const [UserTyping, setUserTyping] = useState(false)




    const resetAlertState = () => {  //todo : any best way to handle AlertUser component??
        setAlert({
            active: false,
            cause: "",
            msg: ""
        });
        // console.log(alert.active, alert.msg); //this will not log current state as the setAlert performs asynchronous updation
    }

    const chat_id = dyParams.id;
    // console.log("chat ID : ", chat_id);
    const user = getLoggedUser();
    var status = "online"
    var otheruser = JSON.parse(localStorage.getItem("otherUserInfo"));
    // var socket;

    function adjustContainerHeight() {
        const textarea = document.querySelector('.message-input');
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
    const sendMessage = () => {
        console.log("SendMessage Fired to", chat_id);
        socket.emit("stop typing", chat_id);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        axios
            .post(
                '/api/message',
                {
                    content: messageContent,
                    chatId: chat_id,
                },
                config
            )
            .then(({ data }) => {
                console.log("Received acknloedgment of Message Fired");
                socket.emit("new message", data);
                // setAllMessages([...AllMessages, data])
                setAllMessages(prevMessages => [...prevMessages, data]);
                setrefresh(!refresh);
            }).catch((e) => {
                console.log(e);
                setAlert({ active: true, cause: "error", msg: "Failed to send message" });

            })
    };





    useEffect(() => {
        console.log("Messages loaded in Chatarea");
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        async function fetchchat() {
            const { data } = await axios.get(`/api/message/${chat_id}`, config);
            // console.log("fetched chat : ", data)
            setAllMessages(data);
            setloading(false);

            console.log("socket in useeffect : ", socket)
            socket
                && socket.emit("join chat", { username: user.name, room: chat_id });
            // setAllMessagesCopy(AllMessages);

        }
        fetchchat();
        return () => setloading(true);
        // }, [chat_id, user._id, user.token]);
        // }, [refresh, chat_id]);
    }, [socket, chat_id]);





    useEffect(() => {
        socket &&
            socket.on("message recieved", (newMessageRecieved) => {
                if (
                    // !selectedChatCompare || // if chat is not selected or doesn't match current chat
                    chat_id !== newMessageRecieved.chat._id
                ) {
                    // if (!notification.includes(newMessageRecieved)) {
                    //     setNotification([newMessageRecieved, ...notification]);
                    //     setFetchAgain(!fetchAgain);
                    // } 
                    //implement notification


                    //TO DO : SAVE NOTIFICATION ID TO MAKE IT REFRESH RESISTANT
                    console.log("Notification : ", newMessageRecieved);
                    setNotifications((prevNotifs) =>
                        [
                            ...prevNotifs,
                            newMessageRecieved.chat._id
                        ]
                    )

                } else {
                    setAllMessages((state) =>
                        [
                            ...state,

                            newMessageRecieved

                        ]

                    )
                }

                console.log("msg from socket : ", newMessageRecieved);
                setrefresh((state) => !state);
            });


        return () => socket && socket.off('message recieved');
    }, [socket, AllMessages, refresh, notifications]);


    useEffect(() => {
        socket && console.log('inside typing socket:', socket);
        socket && socket.on("typing", () => setIsTyping(true));
        socket && socket.on("stop typing", () => setIsTyping(false));

        // return () => {
        //     socket && socket.off("typing");
        //     socket && socket.off("stop typing");
        // };
    }, [socket]);

    var typingHandler = (e) => {
        console.log("socket status : ", socketconnected)
        setmessageContent(e.target.value);

        if (!socketconnected) return;

        if (!typing) {
            setTyping(true);
            console.log('====================================');
            console.log("inside typing condition : ", typing);
            console.log('====================================');
            socket.emit("typing", chat_id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 2000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            console.log("settime out :", timeDiff, "typing : ", typing)
            if (timeDiff >= timerLength) {
                socket.emit("stop typing", chat_id);
                console.log("inside typing condition ka bhi inside : ", typing);
                setTyping(false);
            }
        }, timerLength);
    };









    return (
        <div className='chatArea-container'>

            <div className={"chatarea-header" + (lightTheme ? "" : " dark")}>
                <Profilepic pp={otheruser.pp} firstname={otheruser.name[0]} />
                <div className='header-text'>
                    <div className={"con-title" + (lightTheme ? "" : " dark")}>{otheruser.name}</div>
                    <div className={"status" + (lightTheme ? "" : " dark")}>{status}</div>
                </div>
                <IconButton >
                    <DeleteIcon className={!lightTheme && 'dark'} />
                </IconButton>
            </div>

            <ScrollableFeed className='scroll'>

                {/* <div className={"chatarea-body" + (lightTheme ? "" : " dark")}>

                    {(loading) ? <LoadSkeleton /> : (
                        AllMessages.slice(0).map((message, index) => {
                            // AllMessages.slice(0).reverse().map((message, index)=>{
                            const sender = message.sender;
                            const self_id = user._id;
                            if (sender._id === self_id) {
                                return <MessageSelf props={message} key={index} />
                            } else {
                                // console.log("i am from mesage other")
                                return <MessageOther props={message} key={index} />

                            }

                        }

                        )
                        {istyping}
                    )}
                </div> */}

                <div className={"chatarea-body" + (lightTheme ? "" : " dark")}>
                    {loading ? (
                        <LoadSkeleton />
                    ) : (
                        AllMessages.slice(0).map((message, index) => {
                            const sender = message.sender;
                            const self_id = user._id;
                            if (sender._id === self_id) {
                                return <MessageSelf props={message} key={index} />;
                            } else {
                                return <MessageOther props={message} key={index} />;
                            }
                        })
                    )}
                    {/* {"hi"} */}
                    {istyping && (
                        <Lottie
                            animationData={typinganimation}
                            loop={true}
                            style={{ width: '50px', marginLeft:"10px", height:"20px"}}
                        />
                    )}
                    {/* {istyping && <>"typing"</>} */}
                    {console.log("typing status : ", istyping)}
                </div>


            </ScrollableFeed>
            <div className={"chatarea-input" + (lightTheme ? "" : " dark")}>
                <div className="input-container">
                    <textarea
                        className={"message-input" + (lightTheme ? "" : " dark")}
                        placeholder="Type a message"
                        value={messageContent}
                        onChange={typingHandler}
                        // onChange={(e) => { setmessageContent(e.target.value) }}
                        onKeyDown={(event) => {
                            if (event.code === "Enter") {
                                event.preventDefault(); // Prevent the default Enter key behavior
                                sendMessage();
                                setmessageContent("");
                                // setrefresh(!refresh);
                                // setrefresh(!refresh);
                            }
                        }}
                        onInput={adjustContainerHeight}
                    ></textarea>
                </div>
                <IconButton
                    className={"icon" + (lightTheme ? "" : " dark")}
                    onClick={() => {
                        sendMessage();
                        setmessageContent("");
                        setrefresh(!refresh);
                    }}
                >
                    <SendIcon className={!lightTheme && 'dark'} />
                </IconButton>
                {alert.active && (<><AlertUser msg={alert.msg} cause={alert.cause} resetState={resetAlertState} /> </>)}
            </div>


        </div >
    )
}

export default ChatArea