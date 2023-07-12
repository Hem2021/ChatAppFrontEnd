import React, { useContext, useEffect, useState } from 'react'
import logo from '../logo.png';
import './myStyles.css'
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AlertUser from './AlertUser';
import { useNavigate } from 'react-router-dom';
import { globalContext } from '../Contex/ContextProvider';
import UserList from './UserList';
import axios from 'axios';
import LoadSkeleton from './Loading/LoadSkeleton';
import { useSelector } from 'react-redux';
import { getLoggedUser } from './misc/utili';


function OnlineUsers() {
    var lightTheme = useSelector((state) => { return state.lightTheme });
    const { refresh, setrefresh } = useContext(globalContext);
    var [users, setusers] = useState([]);
    // var [searchresult, setsearchresult] = useState([]);
    var [searchinput, setsearchinput] = useState();
    const [Loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
    }
    var user = getLoggedUser();
    if (!user) {
        navigate('/', { replace: true });
    }


    var handleSearch = async () => {
        console.log(`to do : implement handle search for all online users`);
    }
    // var handleSearch = async () => {
    //     if (!searchinput) {
    //         setAlert({ active: true, cause: "warning", msg: "Input all fields" });
    //         return;
    //     }
    //     try {
    //         setLoading(true);
    //         const config = {
    //             headers: {
    //                 Authorization: `Bearer ${user.token}`,
    //             },
    //         };

    //         const { data } = await axios.get(`/api/user?search=${searchinput}`, config);

    //         if (data.length === 0) {
    //             setAlert({ active: true, cause: "warning", msg: "No users found" });
    //             setLoading(false);
    //             // return;
    //         }

    //         setLoading(false);
    //         setsearchresult(data);
    //     } catch (error) {
    //         setAlert({ active: true, cause: "error", msg: "Failed to load users" });
    //         setLoading(false);
    //     }
    // }


    useEffect(() => {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios.get(`/api/user`, config)
            .then((res) => {
                const { data } = res;
                if (data.length === 0) {
                    <span>No Online Users</span>
                } else {
                    setusers(data);

                }
                setLoading(false)
            })
            .catch((e) => {
                setAlert({ active: true, cause: "error", msg: "Failed to load users" });
                setLoading(false);
            })
    }, [refresh])

    return (
        <div className='ou-container'>
            <div className='ou-header'>
                <img src={logo} style={{ width: "36px" }} alt='logo' className='ou-header-logo'></img>
                <p style={{
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    fontSize: "1rem",
                    color: "rgba(0, 0, 0, 0.54)",
                    fontWeight: "bold"
                }}>Online Users</p>
            </div>
            <div className='ou-search'>
                <IconButton onClick={handleSearch}>
                    <SearchIcon />
                </IconButton>
                {/* <input className='sb-search-input' placeholder='search' onChange={(e) => {
                    setsearchinput(e.target.value)
                }}></input> */}

                <input
                    className="sb-search-input"
                    placeholder="search"
                    onChange={(e) => {
                        setsearchinput(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent form submission or other default behavior
                            handleSearch();
                        }
                    }}
                />

            </div>
            {(Loading ? <LoadSkeleton /> : (

                <div className={"sb-conversation test" + (lightTheme ? "" : " dark")}>
                    {users.map((otherusers) => {

                        return <UserList key={otherusers._id} otherusers={otherusers}></UserList>
                    })}
                </div>))}


            {alert.active && (<><AlertUser msg={alert.msg} cause={alert.cause} resetState={resetAlertState} /> </>)}

        </div>
    )
}

export default OnlineUsers