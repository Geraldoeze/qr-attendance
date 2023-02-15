import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui

import { Container, Typography, Stack, Grid } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { DashboardUser } from '../components/dashboardUser';

import { useHttpClient } from '../hooks/http-hook';

import { AppWidgetSummary } from '../sections/@dashboard/app';
import LoadingSpinner from '../UIElement/LoadingSpinner';
import ErrorModal from '../UIElement/Modal/ErrorModal';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const navigate = useNavigate();
  const [response, setResponse] = useState();
  const [depart, setDepart] = useState();
  const [attendance, setAttendance] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // fetch students data
  useEffect(() => {
    // const getData = async () => {
    //   try {
    //     const send = await sendRequest(`https://biometric-node.vercel.app/users`);
    //     const getAttendance = await sendRequest(`https://biometric-node.vercel.app/users/attendanceList`);
    //     const getCourses = await sendRequest(`https://biometric-node.vercel.app/admin/getDept`);
    //     setDepart(getCourses.response);
    //     setAttendance(getAttendance.response);
    //     setResponse(send.response);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };
    // getData();
  }, []);

  const getDepartment = () => {
    navigate(`/create/dept`, { replace: true });
  };
  const getAttendance = () => {
    navigate(`/attendance`, { replace: true });
  };
  const getUsers = () => {
    // navigate(`/create/dept`, { replace: true });
  };
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#2065D1' }} variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography sx={{ color: '#2065D1' }} variant="h5">
            All Info
          </Typography>
        </Stack>

        <Grid container spacing={7} sx={{ justifyContent: 'space-around', marginY: '2rem' }}>
          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} onClick={getDepartment}>
            <AppWidgetSummary title="Departments" total={depart?.length} color="success" icon={<LocalLibraryIcon />} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} onClick={getAttendance}>
            <AppWidgetSummary
              title="Attendance"
              total={attendance?.length}
              color="error"
              icon={<PlaylistAddCheckIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} onClick={getUsers}>
            <AppWidgetSummary title="Users" total={response?.length} color="info" icon={<GroupAddIcon />} />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="xl">
        {isLoading && <LoadingSpinner asOverlay />}
        <ErrorModal open={error} error={error} onClose={clearError} response={null} />
        {response && <DashboardUser responseData={response} />}
      </Container>
    </>
  );
}
