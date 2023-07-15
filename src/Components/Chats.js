import React from 'react'
import SbConContainer from './SbConContainer'
import { useSelector } from 'react-redux';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Chats() {
    var lightTheme = useSelector((state) => { return state.lightTheme });
    return (
        // <div>Chats</div>
        <div className={"mob" + (lightTheme ? "" : " dark")}>
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

export default Chats

