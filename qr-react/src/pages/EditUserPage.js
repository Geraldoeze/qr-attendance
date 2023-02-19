import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';

import { Container, Typography, Stack } from '@mui/material';

import EditUser from '../sections/profile/EditUser';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';

const EditUserPage = () => {
  const auth = useContext(AuthContext);
  const [response, setResponse] = useState();
  
  const { sendRequest } = useHttpClient();
  const getUserId = window.location.pathname.split('/');
  const userId = getUserId[getUserId.length - 1];

  // fetch user data
  useEffect(() => {
    const getData = async () => {
      if (!!auth.token) {
        try {
          const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/getuser/${userId}`, 'GET', null, {
            Authorization: 'Bearer ' + auth.token,
          });
          setResponse(send.response[0]);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getData();
  }, [auth.token]);

  return (
    <>
      <Helmet>
        <title> Edit Minister </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography sx={{ color: '#FF0000' }} variant="h4" gutterBottom>
            Edit Minister Information
          </Typography>
        </Stack>
        {!!response && <EditUser user={response} />}
      </Container>
    </>
  );
};

export default EditUserPage;
