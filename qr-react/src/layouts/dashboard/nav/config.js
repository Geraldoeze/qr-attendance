import React, { useContext} from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import GridViewIcon from '@mui/icons-material/GridView';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


import { AuthContext } from '../../../context/auth-context'


// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const NavConfig = () => {
  
  const auth = useContext(AuthContext);
  const {isLoggedIn} = auth

  const loggedIn = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: <GridViewIcon />,
    },
    {
      title: 'new Student',
      path: "/new/user",
      icon: <GroupAddIcon/>,
    },

    {
      title: 'department',
      path: '/create/dept',
      icon: <AddCircleOutlineIcon/>,
    },
    {
      title: 'attendance',
      path: '/attendance',
      icon: <PlaylistAddCheckIcon/>,
    },
    {
      title: 'admin',
      path: '/admin',
      icon: <AdminPanelSettingsIcon />,
    },
  ]

  const notLoggedIn = [
    {
      title: 'login',
      path: '/auth',
      icon: icon('ic_lock'),
    },
  ]
  const content = isLoggedIn ? loggedIn : notLoggedIn
  return ( content )
   
}
 
export default NavConfig;


