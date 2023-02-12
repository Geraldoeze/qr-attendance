
import { Helmet } from 'react-helmet-async';
import {useState, useEffect} from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Typography, Stack, Button } from '@mui/material';

import LoadingSpinner from '../UIElement/LoadingSpinner';
import AttendanceList from '../sections/attendance/AttendanceList';


const UserAttendancePage = () => {
    return ( 
        <>
        
        <Helmet>
        <title> Attendance </title>
      </Helmet>

      <Container maxWidth="xl">
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{color: '#000080'}} variant="h4" gutterBottom>
          Attendance
          </Typography>
          <Typography sx={{color: '#000080'}} variant="h5" gutterBottom>
            All Attendance
          </Typography>
        </Stack>
        <AttendanceList />
        
        </Container>
        </>
     );
}
 
export default UserAttendancePage;

