import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../components/iconify';

import { useHttpClient } from '../hooks/http-hook';
import LoadingSpinner from '../UIElement/LoadingSpinner';
import ErrorModal from '../UIElement/Modal/ErrorModal';

const StyledDiv = styled('div')(({ theme }) => ({
  margin: '0',
  border: '10px',
  width: '100%',
  padding: '1rem',
  backgroundColor: '#14162F',
color: 'white',
  borderRadius: '5px',
}));

const UserssPage = () => {
  const [data, setData] = useState();
  const { isLoading, sendRequest, error, clearError, resMessage } = useHttpClient();
  const getUserId = window.location.pathname.split('/');
  const userId = getUserId[getUserId.length - 1];
  const  navigate = useNavigate();

  useEffect(() => {
    const studentData = async () => {
      try {
        const send = await sendRequest(`https://biometric-node.vercel.app/users/getUser/${userId}`);
        setData(send.response);
      } catch (err) {
        console.log(err);
      }
    };
    studentData();
  }, []);
console.log(data)
  const deleteUserHandler = async () => {
    try {
      const deleteUser = await sendRequest(`https://biometric-node.vercel.app/admin/delete/${userId}`, 'DELETE');
      console.log(deleteUser)
      navigate('/dashboard', {replace: true});
    } catch(err) {
      console.log(err);
    }
  }
  return (
    <>
      {isLoading && <LoadingSpinner />}
      <ErrorModal open={error} onClose={clearError} error={error} response={null} />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{color: '#000080'}} variant="h4" gutterBottom>
            Student Details
          </Typography>
          <Button
            onClick={deleteUserHandler}
            sx={{px:3, backgroundColor: 'rgb(200,0,0)' }}
            variant="contained"
            
          >
            Delete
          </Button>
          <Button
            href={`/admin/editStudent/${userId}`}
            sx={{ backgroundColor: '#14162F' }}
            variant="contained"
            
          >
            Edit Details
          </Button>
        </Stack>

        {isLoading && <LoadingSpinner asOverlay />}
        {data &&
          data?.map((val, ide) => {
            return (
              <StyledDiv key={val._id}>
                <Stack direction="row" alignItems="start" my={1}>
                  <Typography variant="h6" gutterBottom width="45%" my={1}>
                    First Name : {val.firstName}
                  </Typography>
                  <Typography variant="h6" gutterBottom my={1}>
                    Last Name : {val.lastName}
                  </Typography>
                </Stack>
                <Typography variant="h6" gutterBottom my={2}>
                  Matric No : {val.matric}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Department : {val.department.toUpperCase()}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Courses : {val.courses.toString().split(',').join(', ')}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Level : {val.levelId}
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
                  State of Origin : {val.origin}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Address : {val.address}
                </Typography>
                <Typography variant="h6" gutterBottom my={2}>
                  Country : {val.country}
                </Typography>
              </StyledDiv>
            );
          })}
      </Container>
    </>
  );
};

export default UserssPage;
