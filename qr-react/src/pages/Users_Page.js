import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';

import { useNavigate } from 'react-router-dom';
// @mui

import { Container, Typography, Stack } from '@mui/material';

import { DashboardUser } from '../components/dashboardUser';

import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

import { AppWidgetSummary } from '../sections/@dashboard/app';
import LoadingSpinner from '../UIElement/LoadingSpinner';
import ErrorModal from '../UIElement/Modal/ErrorModal';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UsersPage() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [response, setResponse] = useState();

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // fetch all users
  useEffect(() => {
    const getUsers = async () => {
      if (!!auth.token) {
        try {
          const send = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users', 'GET', null, {
            Authorization: 'Bearer ' + auth.token,
          });
          console.log(send);
          setResponse(send.response);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getUsers();
  }, [auth.token]);

  const deleteUserInfo = async (userId) => {
    setResponse((response) => response?.filter((del) => del._id !== userId));

    const deleteAccount = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/users/delete/${userId}`,
      'DELETE',
      null,
      {
        Authorization: 'Bearer ' + auth.token,
      }
    );
    console.log(deleteAccount);
  };

  return (
    <>
      <Helmet>
        <title> Ministers </title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#900C3F' }} variant="h4" gutterBottom>
            Ministers List
          </Typography>
          <Typography sx={{ color: '#900C3F' }} variant="h5">
            All Information
          </Typography>
        </Stack>
      </Container>

      <Container maxWidth="xl">
        {isLoading && <LoadingSpinner asOverlay />}
        <ErrorModal open={error} error={error} onClose={clearError} response={null} />
        {response && <DashboardUser responseData={response} deleteUser={deleteUserInfo} />}
      </Container>
    </>
  );
}
