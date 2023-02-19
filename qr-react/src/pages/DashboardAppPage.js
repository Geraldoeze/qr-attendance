import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui

import { Container, Typography, Stack, Grid } from '@mui/material';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import { DashboardUser } from '../components/dashboardUser';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
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

  
  useEffect(() => {
  
  }, []);

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
          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} >
            <AppWidgetSummary title="Regional Pastors" total={depart?.length} color="success" icon={<LocalLibraryIcon />} />
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} >
            <AppWidgetSummary
              title="Attendance"
              total={attendance?.length}
              color="error"
              icon={<PlaylistAddCheckIcon />}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} sx={{ cursor: 'pointer' }} >
            <AppWidgetSummary title="Ministers" total={response?.length} color="info" icon={<PeopleAltIcon />} />
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
