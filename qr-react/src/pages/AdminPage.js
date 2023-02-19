import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';
import { Container, Typography, Stack, Button, Box } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import Iconify from '../components/iconify';
import { AdminIndex } from '../components/adminIndex';

import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';

import LoadingSpinner from '../UIElement/LoadingSpinner';
import ErrorModal from '../UIElement/Modal/ErrorModal';

const AdminPage = () => {
  const [response, setResponse] = useState();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const navigate = useNavigate();
 
  // fetch all sub admin
  useEffect(() => {
    const userProfile = async () => {
      if (!!auth.token) {
      try {
        const send = await sendRequest( `${process.env.REACT_APP_BACKEND_URL}/admin/get`, "GET", null,
          {
              Authorization: 'Bearer ' + auth.token
          }
        );
        setResponse(send.response);
      } catch (err) {
        console.log(err);
      }
    }
    };
    userProfile();
  }, [auth.token]);

  

  const deleteUserInfo = async (userId) => {
    setResponse((response) => response?.filter((del) => del._id !== userId));
    
    const deleteAccount = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/delete/${userId}`, "DELETE", null,
        {
            Authorization: 'Bearer ' + auth.token
        }
      );
    console.log(deleteAccount)
  }

  
  return (
    <>
      <Helmet>
        <title> Pastor </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom sx={{color: '#FF0000'}}>
           Regional Pastor
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6">{auth?.userDetails?.firstName}</Typography>
            <Typography variant="h6">{auth?.userDetails?.email}</Typography>
          </Stack>
        </Stack>
   
   
         
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}>
          <Button  
            href='/dashboard/members'
            sx={{ backgroundColor: '#FF0000', p:2, px:5, my:2, color: 'white', "&:hover":{backgroundColor:'#4A0404'} }} variant="contained">
            Minister List
          </Button>
          <Button  sx={{ backgroundColor: '#FF0000', p:2, px:5, my:2, color: 'white', "&:hover":{backgroundColor:'#4A0404'}  }} variant="contained">
            Events List
          </Button>
          <Button
            href='/new/user'
            sx={{ backgroundColor: '#FF0000', p:2, px:5, my:2, color: 'white', "&:hover":{backgroundColor:'#4A0404'} }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Minister
          </Button>
        </Box>
        <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
        <Button
            href='/admin/create'
            sx={{ backgroundColor: '#FF0000', p:2, px:5, width: '50%', color: 'white', "&:hover":{backgroundColor:'#4A0404'} }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Regional Pastor
          </Button>
        </Stack>
      <Stack direction="column"  sx={{p:2}} borderRadius={2} boxShadow={5} alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h6">Regional Pastor List.!!</Typography>
      </Stack>

        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
          {isLoading && <LoadingSpinner asOverlay />}
          <ErrorModal error={error} onClose={clearError} open={error}  />
          {response && <AdminIndex responseData={response} deleteUser={deleteUserInfo} />}
        </Stack>
      </Container>
    </>
  );
};

export default AdminPage;
