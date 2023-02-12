import { Helmet } from 'react-helmet-async';
import {useState, useEffect, useContext} from 'react';

import { Container, Typography, Stack } from '@mui/material';

import { NewUserForm } from '../sections/admin/newUser'
import { useHttpClient } from '../hooks/http-hook';
import ErrorModal from '../UIElement/Modal/ErrorModal';

const NewUserPage = () => {
    const [ response, setResponse ] = useState(); 

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

      // fetch department data
  useEffect(() => {
    const getData = async () => {
    try {
     const send = await sendRequest(`https://biometric-node.vercel.app/admin/getDept`)
     setResponse(send.response)
     console.log(send);
    } catch (err) {
      console.log(err)
    }
  }
  getData();
 },[])

    return ( 
        <>
          <Helmet>
        <title> New Student </title>
      </Helmet>

      <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography sx={{color: '#000080'}} variant="h4" gutterBottom>
            New student
          </Typography>
        </Stack>
        < ErrorModal open={error} error={error} onClose={clearError} response={null}/>
        <NewUserForm dept={response} />
      </Container>
        
        </>

     );
}
 
export default NewUserPage;
