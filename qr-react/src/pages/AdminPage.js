import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';
import { Container, Typography, Stack, Button } from '@mui/material';

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

  const newSudentHandler = () => {
    navigate("/new/user", { replace: true });
  };

  const newDepartmentHandler = () => {
    navigate("/create/dept", { replace: true });
  };

  const deleteUserInfo = async (userId) => {
    setResponse((response) => response?.filter((del) => del._id !== userId));
    // const send =await sendRequest(`${process.env.BACKEND_URL}/admin/delete/${userId}`, "DELETE", null,
    // {
//          Authorization: 'Bearer ' + auth.token
    // }
    // )
    // console.log(send)
  }

  
  return (
    <>
      <Helmet>
        <title> Admin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
           Super Admin
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6">{auth?.userDetails?.name}</Typography>
            <Typography variant="h6">{auth?.userDetails?.email}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Button  
            href='/dashboard/members'
            sx={{ backgroundColor: '#14162F', p:2 }} variant="contained">
            Members List
          </Button>
          <Button  sx={{ backgroundColor: '#14162F', p:2, px:5  }} variant="contained">
            Events List
          </Button>
          <Button
            href='/new/user'
            sx={{ backgroundColor: '#14162F', p:2 }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Member
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="center" mb={5}>
        <Button
            href='/admin/create'
            sx={{ backgroundColor: '#14162F', p:2, width: '40%' }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Create Admin
          </Button>
        </Stack>
      <Stack direction="column"  sx={{p:2}} borderRadius={2} boxShadow={5} alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h6">Admin List.!!</Typography>
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
