import React, { useState } from 'react'
import './myStyles.css'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NightlightIcon from '@mui/icons-material/Nightlight';
import LightModeIcon from '@mui/icons-material/LightMode';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ConversationItem from './ConversationItem';
import { Navigate, useAsyncError, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ForumIcon from '@mui/icons-material/Forum';

import { toggleTheme } from '../features/darkMode';
import SbConContainer from './SbConContainer';
import BasicMenu from './BasicMenu';
function Sidebar() {
    var dispatch = useDispatch();
    var lightTheme = useSelector((state) => { return state.lightTheme });
    function setLightTheme() {
        dispatch(toggleTheme());
    }


    var navigate = useNavigate();
    var [conversations, setConversation] = useState([
        {
            name: 'Test1',
            lastMessage: 'Last Message #1',
            timeStamp: 'today'
        },
        {
            name: 'Test2',
            lastMessage: 'Last Message #2',
            timeStamp: 'today'
        },
        {
            name: 'Test3',
            lastMessage: 'Last Message #3',
            timeStamp: 'today'
        }
    ])
    return (
        <div className='Sidebar'>

            <div className={"sb-header" + (lightTheme ? "" : " dark")}>
                <div className='sb-header-div1'>
                    <BasicMenu />
                </div>

                <div className='sb-header-div2'>
                    {/* <IconButton > */}
                        <IconButton onClick={() => {
                        navigate('users');
                    }} >
                        <PersonAddIcon className={!lightTheme && "dark"} />
                    </IconButton>
                    <IconButton onClick={() => {
                        navigate('groups');  // TODO: add available-group component
                    }} >
                        <GroupAddIcon className={!lightTheme && "dark"} />
                    </IconButton>
                    <IconButton onClick={() => {
                        navigate('create-group');
                    }} >
                        <AddCircleIcon className={!lightTheme && "dark"} />
                    </IconButton>
                    <IconButton onClick={() => {
                        setLightTheme();
                    }}>
                        {!lightTheme && <LightModeIcon className={!lightTheme && "dark"} />}
                        {lightTheme && <NightlightIcon className={!lightTheme && "dark"} />}
                        {/* <NightlightIcon /> */}
                    </IconButton>
                </div>

                <div className='sb-header-div3'>
                    <IconButton>
                        <ForumIcon className={!lightTheme && "dark"} />
                    </IconButton>
                </div>
            </div>

            <div className={"sb-search" + (lightTheme ? "" : " dark")} >
                <IconButton>
                    <SearchIcon className={!lightTheme && "dark"} />
                </IconButton>
                <input className={"sb-search-input" + (lightTheme ? "" : " dark")} placeholder='search'></input>
            </div>
            <SbConContainer />
        </div>
    )
}

export default Sidebar
