import React from 'react'
import { Helmet } from 'react-helmet-async';

import { Container, Typography, Stack  } from '@mui/material';

import NewAdmin from '../sections/admin/newAdmin/NewAdmin';

export default function NewAdminPage() {
  return (
    <>
    <Helmet>
        <title> Create Admin </title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#2065D1' }} variant="h4" gutterBottom>
            Create New Admin
          </Typography>
          <Typography sx={{ color: '#2065D1' }} variant="h5">
            Sub Admin
          </Typography>
        </Stack>

        <NewAdmin />
        </Container>
    </>
  )
}
