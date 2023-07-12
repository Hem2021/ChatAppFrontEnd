import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { globalContext } from '../Contex/ContextProvider';
import { Avatar, Divider, ListItemIcon } from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getLoggedUser } from './misc/utili';
// import { Navigate } from 'react-router-dom';


export default function BasicMenu() {
  var { setselectedchat } = React.useContext(globalContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const user = getLoggedUser();
  if(!user){
    navigate('/');
  }
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    // console.log(event.currentTarget)
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const logOutUser = async () => {
    //  localStorage.setItem("userInfo", JSON.stringify(''));
    localStorage.clear();
    sessionStorage.removeItem('yourAppHistory');
    setselectedchat({});

    navigate('/', { replace: true });
  }


  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {/* Dashboard */}
        {user && <img className='con-icon' src={user.pp} alt='U' ></img>}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Avatar sx={{ width: 25, height: 25 }} />
          </ListItemIcon>
          Profile
        </MenuItem>

        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logOutUser}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </div>
  );
}