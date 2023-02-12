import { Helmet } from 'react-helmet-async';

// @mui

import { Container, Typography, Stack } from '@mui/material';

import DepartmentList from '../sections/admin/Department/DepartmentList';

// ----------------------------------------------------------------------

const DepartmentPage = () => {
  return (
    <>
      <Helmet>
        <title> Department </title>
      </Helmet>

      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#000080' }} variant="h4" gutterBottom>
            Department
          </Typography>
          <Typography sx={{ color: '#000080' }} variant="h5" gutterBottom>
            All Department
          </Typography>
        </Stack>

        <DepartmentList />
      </Container>
    </>
  );
};

export default DepartmentPage;
