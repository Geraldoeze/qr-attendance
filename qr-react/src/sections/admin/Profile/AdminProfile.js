import { Helmet } from 'react-helmet-async';
import { useEffect, useState, useContext } from 'react';
import { Container, Typography, Stack, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
import ErrorModal from '../../../UIElement/Modal/ErrorModal';

import { AuthContext } from '../../../context/auth-context';
import DeleteAdmin from './DeleteAdmin';

const StyledDiv = styled('div')(({ theme }) => ({
  margin: '0',
  border: '10px',
  width: '100%',
  padding: '1rem',
  backgroundColor: '#4A0404',
  color: 'white',
  borderRadius: '5px',
}));

export default function AdminProfile() {
  const auth = useContext(AuthContext);
  const [data, setData] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const { isLoading, sendRequest, error, clearError, resMessage } = useHttpClient();
  const getUserId = window.location.pathname.split('/');
  const userId = getUserId[getUserId.length - 1];

  useEffect(() => {
    const getAdmin = async () => {
      if (!!auth.token) {
        try {
          const send = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/admin/single/admin/${userId}`,
            'GET',
            null,
            {
              Authorization: 'Bearer ' + auth.token,
            }
          );
          console.log(send);
          setData(send.response);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getAdmin();
  }, [auth.token]);

  const OpenDeleteUser = () => setOpenDelete(true);
  const CloseDeleteUser = () => setOpenDelete(false);
  let currentId;
  if (!!data) {
    currentId = data?.[0]._id;
  }

  return (
    <>
      <Helmet>
        <title> Profile </title>
      </Helmet>
      {openDelete && <DeleteAdmin open={openDelete} onClose={CloseDeleteUser} adminId={currentId} />}
      {isLoading && <LoadingSpinner />}
      <ErrorModal open={error} onClose={clearError} error={error} response={null} />
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            p: 1,
            m: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
          }}
        >
          <Typography sx={{ color: '#900C3F' }} variant="h3" gutterBottom>
            Pastor Profile
          </Typography>

          <Button href={`/admin/edit/${userId}`} sx={{ backgroundColor: '#14162F', width: '20%' }} variant="contained">
            Edit Details
          </Button>
          <Button
            onClick={OpenDeleteUser}
            sx={{ px: 3, backgroundColor: '#4A0404', width: '15%' }}
            variant="contained"
          >
            Delete
          </Button>
        </Box>
        <Stack
          direction="column"
          sx={{ p: 5 }}
          borderRadius={2}
          boxShadow={5}
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h6">Regional Pastor Profile.!!</Typography>
        </Stack>
        {isLoading && <LoadingSpinner asOverlay />}
        {data &&
          data?.map((val, ide) => {
            return (
              <StyledDiv key={val._id}>
                <Stack>{/* Avatar Image gotten from be */}</Stack>
                <Stack direction="row" alignItems="start" my={1}>
                  <Typography variant="h6" gutterBottom width="45%" my={1}>
                    First Name : {val.firstName}
                  </Typography>
                  <Typography variant="h6" gutterBottom my={1}>
                    Last Name : {val.lastName}
                  </Typography>
                </Stack>
                <Typography variant="h6" gutterBottom my={2}>
                  Access Level : {val.accessLevel}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Email : {val.email}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Title : {val.title}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Contact No : {val.contact}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Gender : {val.gender}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Access Level : {val.accessLevel}
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
}
