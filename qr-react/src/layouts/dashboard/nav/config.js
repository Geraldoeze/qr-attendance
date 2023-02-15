import React, { useContext} from 'react';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import GridViewIcon from '@mui/icons-material/GridView';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { AuthContext } from '../../../context/auth-context'


// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;


const NavConfig = () => {
  
  const auth = useContext(AuthContext);
  const {isLoggedIn, accountType, userId} = auth
  
  

  const userAccess = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: <GridViewIcon />,
    },
    {
      title: 'Profile',
      path:  `/user/profile/${userId}`,
      icon: <ManageAccountsIcon/>,
    },
    {
      title: 'Logout',
      path: '/auth/logout',
      icon: <ExitToAppIcon />,
    },
  ]

  const adminAccess = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: <GridViewIcon />,
    },
    {
      title: 'new Member',
      path: "/new/user",
      icon: <GroupAddIcon/>,
    },
    {
      title: 'Members',
      path: '/dashboard/members',
      icon: <PeopleAltIcon />,
    },
    {
      title: 'Event',
      path: '/create/event',
      icon: <EventNoteIcon/>,
    },
    {
      title: 'Profile',
      path: '/user/profile',
      icon: <ManageAccountsIcon/>,
    },
    {
      title: 'attendance',
      path: '/attendance',
      icon: <PlaylistAddCheckIcon/>,
    },
    {
      title: 'Logout',
      path: '/auth/logout',
      icon: <ExitToAppIcon />,
    }
  ]

  const superAdminAccess = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: <GridViewIcon />,
    },
    {
      title: 'Members',
      path: '/dashboard/members',
      icon: <PeopleAltIcon />,
    },
    {
      title: 'new Member',
      path: "/new/user",
      icon: <GroupAddIcon/>,
    },
    
    {
      title: 'Event',
      path: '/create/event',
      icon: <EventNoteIcon/>,
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
    {
      title: 'Logout',
      path: '/auth/logout',
      icon: <ExitToAppIcon/>,
    },
  ]
  const loggedIn = [
    {
      title: 'dashboard',
      path: '/dashboard/app',
      icon: <GridViewIcon />,
    },
    {
      title: 'new Member',
      path: "/new/user",
      icon: <GroupAddIcon/>,
    },

    {
      title: 'Event',
      path: '/create/event',
      icon: <AddCircleOutlineIcon/>,
    },
    {
      title: 'attendance',
      path: '/attendance',
      icon: <PlaylistAddCheckIcon/>,
    },
    {
      title: 'settings or Profile',
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
      title: 'dashboard',
      path: '/dashboard/app',
      icon: <GridViewIcon />,
    },
    {
      title: 'login',
      path: '/auth',
      icon: icon('ic_lock'),
    },
  ]
  let content; 
  if (!isLoggedIn) {
    return content = notLoggedIn
  }
  if (isLoggedIn && accountType === "superAdmin") {
    return content = superAdminAccess
  }
  if (isLoggedIn && accountType === "admin") {
    return content = adminAccess
  }
  if (isLoggedIn && accountType === "users") {
    return content = userAccess
  }

  // = isLoggedIn ? loggedIn : notLoggedIn
  return ( content )
   
}
 
export default NavConfig;


