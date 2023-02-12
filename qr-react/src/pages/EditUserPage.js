import { Helmet } from 'react-helmet-async';
import {useState, useEffect, useContext} from 'react';

import { Container, Typography, Stack } from '@mui/material';

import  EditUser  from '../sections/admin/newUser/EditUser'
import { useHttpClient } from '../hooks/http-hook';

const EditUserPage = () => {
    const [ response, setResponse ] = useState(); 
    const [ responseData, setResponseData ] = useState(); 
    const { isLoading, error, sendRequest } = useHttpClient();
    const  getUserId = window.location.pathname.split('/');
    const userId = getUserId[getUserId.length - 1];
     
      // fetch student data
  useEffect(() => {
    const getData = async () => {
    try {
     const send = await sendRequest(`https://biometric-node.vercel.app/users/getUser/${userId}`)
     setResponse(send.response[0])
     console.log(send.response);
    } catch (err) {
      console.log(err)
    }
    try {
        const sendReq = await sendRequest(`https://biometric-node.vercel.app/admin/getDept`)
     setResponseData(sendReq.response)
     console.log(sendReq.response);
    } catch (err) {
        console.log(err)
    }
  }
  getData();
 },[])

    return ( 
        <>
          <Helmet>
        <title> Edit Student </title>
      </Helmet>

      <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography sx={{color: '#000080'}} variant="h4" gutterBottom>
            Edit Student Info
          </Typography>
        </Stack>
       { !!response && <EditUser user={response} dept={responseData} />}
      </Container>
        
        </>

     );
}
 
export default EditUserPage;
