import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { Container, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';


import { useHttpClient } from '../hooks/http-hook';
import LoadingSpinner from '../UIElement/LoadingSpinner';
import ErrorModal from '../UIElement/Modal/ErrorModal';

import { AuthContext } from '../context/auth-context';
import DeleteUser from '../sections/profile/deleteUser';
const StyledDiv = styled('div')(({ theme }) => ({
    margin: '0',
    border: '10px',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#14162F',
    color: 'white',
    borderRadius: '5px',
  }));
  
const Profile = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [data, setData] = useState();
    const [openDelete, setOpenDelete] = useState(false);
    const { isLoading, sendRequest, error, clearError, resMessage } = useHttpClient();
    const getUserId = window.location.pathname.split('/');
    const userId = getUserId[getUserId.length - 1];
    
  
    useEffect(() => {
      const userProfile = async () => {
        if (!!auth.token) {
        try {
          const send = await sendRequest( `${process.env.REACT_APP_BACKEND_URL}/users/getuser/${userId}`, "GET", null,
            {
                Authorization: 'Bearer ' + auth.token
            }
          );
          setData(send.response);
        } catch (err) {
          console.log(err);
        }
      }
      };
      userProfile();
    }, [auth.token]);

    const editUserHandler = () => {
      navigate("/", { replace: true });
    }

  const OpenDeleteUser = () => setOpenDelete(true)
  const CloseDeleteUser = () => setOpenDelete(false)
  
  let currentId;
  if (!!data) {
    currentId = data?.[0]._id;
  }
          
  return (
    <>
      <Helmet>
        <title> Profile </title>
      </Helmet>
      { openDelete && <DeleteUser open={openDelete} onClose={CloseDeleteUser} userId={currentId}/> }
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal open={error} onClose={clearError} error={error} response={null} />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{color: '#000080'}} variant="h3" gutterBottom>
            User Profile
          </Typography>
          <Button
            onClick={OpenDeleteUser}
            sx={{px:3, backgroundColor: 'rgb(200,0,0)' }}
            variant="contained"  
          >
            Delete
          </Button>
          <Button
            href={`/user/edit/${userId}`}
            sx={{ backgroundColor: '#14162F' }}
            variant="contained" 
          >
            Edit Details
          </Button>
        </Stack>
        <Stack direction="column"  sx={{p:2}} borderRadius={2} boxShadow={5} alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h6">User Profile.!!</Typography>
      </Stack>
        {isLoading && <LoadingSpinner asOverlay />}
        {data &&
          data?.map((val, ide) => {
            return (
              <StyledDiv key={val._id}>
                  <Stack>
                      {/* Avatar Image gotten from be */} Picture
                  </Stack>
                <Stack direction="row" alignItems="start" my={1}>
                  <Typography variant="h6" gutterBottom width="45%" my={1}>
                    First Name : {val.firstName}
                  </Typography>
                  <Typography variant="h6" gutterBottom my={1}>
                    Last Name : {val.lastName}
                  </Typography>
                </Stack>
      
                <Typography variant="h6" gutterBottom my={2}>
                  Status : {val.status}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Date of Birth : {val.dob}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Email : {val.email}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Contact No : {val.contact}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Gender : {val.gender}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  State of Origin : {val.origin}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Address : {val.address}
                </Typography>
                
              </StyledDiv>
            );
          })}
      </Container>
    </>
  );
};

export default Profile;