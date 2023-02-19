import { Helmet } from 'react-helmet-async';

// @mui

import { Container, Typography, Stack, Button } from '@mui/material';

import AttendanceList from '../sections/attendance/AttendanceList';

const UserAttendancePage = () => {
  return (
    <>
      <Helmet>
        <title>QR Attendance </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#FF0000' }} variant="h4" gutterBottom>
            QR Attendance
          </Typography>
          <Typography sx={{ color: '#FF0000' }} variant="h5" gutterBottom>
            All Attendance
          </Typography>
        </Stack>
        <AttendanceList />
      </Container>
    </>
  );
};

export default UserAttendancePage;
