import React from 'react'
import { Helmet } from 'react-helmet-async';

import { Container, Typography, Stack  } from '@mui/material';

import NewAdmin from '../sections/admin/newAdmin/NewAdmin';

export default function NewAdminPage() {
  return (
    <>
    <Helmet>
        <title> Create Pastor </title>
      </Helmet>
      <Container maxWidth="xl">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography sx={{ color: '#FF0000' }} variant="h4" gutterBottom>
            Create New Regional Pastor
          </Typography>
          <Typography sx={{ color: '#FF0000' }} variant="h5">
            Reg Pastor
          </Typography>
        </Stack>

        <NewAdmin />
        </Container>
    </>
  )
}
