import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ConversationItem from './ConversationItem';
import { useSelector } from 'react-redux';
import { globalContext } from '../Contex/ContextProvider';
import axios from 'axios';
import AlertUser from './AlertUser';
import LoadSkeleton from './Loading/LoadSkeleton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Center } from '@chakra-ui/react';
import { getLoggedUser } from './misc/utili';

function SbConContainer() {
    const [alert, setAlert] = useState({
        active: false,
        cause: "",
        msg: ""
    })


    const resetAlertState = () => {  //todo : any best way to handle AlertUser component??
        setAlert({
            active: false,
            cause: "",
            msg: ""
        });
        // console.log(alert.active, alert.msg); //this will not log current state as the setAlert performs asynchronous updation
    }

    var { user, refresh } = useContext(globalContext);
    var [chats, setchats] = useState([]);
    var [loading, setloading] = useState(false);
    var navigate = useNavigate();
    // console.log(chats);
    var lightTheme = useSelector((state) => state.lightTheme)
    var user = getLoggedUser();
    if (!user) {
        navigate('/', { replace: true });
    }





    useEffect(() => {
        setloading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };

        axios.get('/api/chat', config)
            .then((res) => {
                var { data } = res;
                console.log('Chats refreshed in sb container: ', data);
                setchats(data);
                console.log('Chats in setchats', chats);
                setloading(false);
            })
            .catch((e) => {
                setAlert({ active: true, cause: "error", msg: "Failed to load chats" });
                setloading(false);
            });
    }, [refresh]);



    return (
        <div className={"sb-conversation test" + (lightTheme ? "" : " dark")}>
            {((chats.length !== 0 && user) && (chats.map((chat) => {
                // {console.log("inside con - container : ",chat)}
                return (
                    <ConversationItem key={chat._id} chat={chat} curr_user={user} />
                    // <>
                    //     {/* {console.log(chat)} */}
                    //     <div>hi</div>

                    // </>
                )

            })))}
            {(loading && chats.length === 0) && (<LoadSkeleton />)}
            {(chats.length === 0 && !loading) ?
                <div className='welcome-text' style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", wordSpacing: "10px" }}>
                    <span>Click</span>
                    <PersonAddIcon className={!lightTheme && "dark"} />
                    <span>to start!</span>

                </div>
                : ""}

            {alert.active && (<><AlertUser msg={alert.msg} cause={alert.cause} resetState={resetAlertState} /> </>)}
        </div>
    )
}

export default SbConContainer