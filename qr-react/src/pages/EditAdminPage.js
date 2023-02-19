import { Helmet } from 'react-helmet-async';
import {useState, useEffect, useContext} from 'react';

import { Container, Typography, Stack } from '@mui/material';

import  EditAdmin  from '../sections/admin/Profile/EditAdmin';
import { AuthContext } from '../context/auth-context';
import { useHttpClient } from '../hooks/http-hook';


export default function EditAdminPage() {
    const auth = useContext(AuthContext);
    const [ response, setResponse ] = useState(); 
    
    const {  sendRequest } = useHttpClient();
    const  getUserId = window.location.pathname.split('/');
    const userId = getUserId[getUserId.length - 1];
     
      // fetch admin data
  useEffect(() => {
    const getData = async () => {
      if(!!auth.token) {
    try {
     const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/single/admin/${userId}`, "GET", null,
     {
      Authorization: 'Bearer ' + auth.token
     }
     )
     setResponse(send.response[0]);
    } catch (err) {
      console.log(err)
    }
  }
  }
  getData();
 },[auth.token])


  return (
    <>
       <Helmet>
        <title> Edit Pastor Details </title>
      </Helmet>

      <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography sx={{color: '#FF0000'}} variant="h4" gutterBottom>
            Edit Pastor Information
          </Typography>
        </Stack>
       { !!response && <EditAdmin user={response}  />}
      </Container>
    </>
  )
}
