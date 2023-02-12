// @mui
import { styled } from '@mui/material/styles';
import { Link, Stack, Container, Typography } from '@mui/material';
// hooks

// components

// sections

import { ForgotPasswordForm } from '../sections/auth/ForgotPassword';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '50vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(2, 0),
}));

export default function ForgotPasswordPage() {
  return (
    <>
      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography sx={{color: '#000080'}} variant="h4" gutterBottom>
              Forgot Password
            </Typography>

            <Typography variant="h5" sx={{ mb: 5, color: '#000060' }}>
              Enter your Email Address
            </Typography>
            <ForgotPasswordForm />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
              <Link href="login" variant="subtitle2" underline="hover">
                Login
              </Link>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
