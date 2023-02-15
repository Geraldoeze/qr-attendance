import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';

import { Container, Typography, Stack } from '@mui/material';

import { SignUpForm } from '../sections/auth/signUp';

const NewUserPage = () => {
  const [response, setResponse] = useState();

  return (
    <>
      <Helmet>
        <title> New Member </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography sx={{ color: '#2065D1' }} variant="h4" gutterBottom>
            New Member
          </Typography>
        </Stack>

        <SignUpForm />
      </Container>
    </>
  );
};

export default NewUserPage;
