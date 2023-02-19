import { Helmet } from 'react-helmet-async';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui

import { Container, Typography, Stack, Grid } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { DashboardUser } from '../components/dashboardUser';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useHttpClient } from '../hooks/http-hook';
import { AuthContext } from '../context/auth-context';

import { AppWidgetSummary } from '../sections/@dashboard/app';
import LoadingSpinner from '../UIElement/LoadingSpinner';
import ErrorModal from '../UIElement/Modal/ErrorModal';
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const [admin, setAdmin] = useState();
  const [attendance, setAttendance] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  
  useEffect(() => {
    const getData = async () => {
      if (!!auth.token) {
      try {
        const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`, "GET", null, 
          {
            
              Authorization: 'Bearer ' + auth.token
          
          }
        );
        const getAttendance = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/attendance`, "GET", null, 
        {
          Authorization: 'Bearer ' + auth.token
      }
        );
        const getCourses = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/get`, "GET", null,
        {
          Authorization: 'Bearer ' + auth.token
      }
        );
        setAdmin(getCourses.response);
        setAttendance(getAttendance.response);
        setUsers(send.response);
      } catch (err) {
        console.log(err);
      }
    }
    };
    getData();
  }, [auth.token]);


  const getPastors = () => {
    navigate(`/admin`, { replace: true });
  };
  const getAttendance = () => {
    navigate(`/attendance`, { replace: true });
  };
  const getMinisters = () => {
    navigate(`/dashboard/members`, { replace: true });
  };
  return (
    <>
      <Helmet>
        <title> Dashboard </title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#FF0000' }} variant="h4" gutterBottom>
            Dashboard
          </Typography>
          <Typography sx={{ color: '#FF0000' }} variant="h5">
            All Info
          </Typography>
        </Stack>

        <Grid container spacing={7} sx={{ justifyContent: 'space-around', marginY: '2rem' }}>
          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} onClick={getPastors}>
            <AppWidgetSummary title="Regional Pastors" total={admin?.length} color="success" icon={<LocalLibraryIcon />} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} onClick={getAttendance} >
            <AppWidgetSummary
              title="Attendance"
              total={attendance?.length}
              color="error"
              icon={<PlaylistAddCheckIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }}  onClick={getMinisters}>
            <AppWidgetSummary title="Ministers" total={users?.length} color="info" icon={<PeopleAltIcon />} />
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="xl">
        {isLoading && <LoadingSpinner asOverlay />}
        <ErrorModal open={error} error={error} onClose={clearError} response={null} />
        {/* {response && <DashboardUser responseData={response} />} */}
      </Container>
    </>
  );
}
