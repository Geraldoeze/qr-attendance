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

  // fetch students data
  useEffect(() => {
    const getData = async () => {
      try {
        const send = await sendRequest(`https://biometric-node.vercel.app/users`);
        setResponse(send.response);
        console.log(send);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const newSudentHandler = () => {
    navigate("/new/user", { replace: true });
  };

  const newDepartmentHandler = () => {
    navigate("/create/dept", { replace: true });
  };

  const deleteUserInfo = async (userId) => {
    setResponse((response) => response?.filter((del) => del._id !== userId));
    const send =await sendRequest(`https://biometric-node.vercel.app/admin/delete/${userId}`, "DELETE")
    console.log(send)
  }

  console.log(auth.userDetails);
  return (
    <>
      <Helmet>
        <title> Admin </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Admin
          </Typography>
          <Stack direction="column" alignItems="flex-end">
            <Typography variant="h6">{auth?.userDetails?.name}</Typography>
            <Typography variant="h6">{auth?.userDetails?.email}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Button onClick={newDepartmentHandler} sx={{ backgroundColor: '#14162F' }} variant="contained">
            Department List
          </Button>
          <Button
            onClick={newSudentHandler}
            sx={{ backgroundColor: '#14162F' }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Student
          </Button>
        </Stack>
        <Stack direction="column" alignItems="center" justifyContent="space-between" mb={5}>
          {isLoading && <LoadingSpinner />}
          <ErrorModal error={error} onClose={clearError} open={error} response={null} />
          {response && <AdminIndex responseData={response} deleteUser={deleteUserInfo} />}
        </Stack>
      </Container>
    </>
  );
};

export default AdminPage;
