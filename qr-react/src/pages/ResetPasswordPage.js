// @mui
import { styled } from '@mui/material/styles';
import { Link, Stack, Container, Typography } from '@mui/material';
// hooks

// components

// sections

import { ResetPasswordForm } from '../sections/auth/resetPassword';
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

export default function ResetPasswordPage() {
  return (
    <>
      <StyledRoot>
        <Container maxWidth="sm">
          <StyledContent>
            <Typography sx={{color: '#000080'}} variant="h4" gutterBottom>
              Reset Password
            </Typography>
            <Typography sx={{color: '#000080'}} variant="subtitle1" gutterBottom>
              Enter new password
            </Typography>
            <ResetPasswordForm />
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
              <Link href="/auth/login" variant="subtitle2" underline="hover">
                Login
              </Link>
            </Stack>
          </StyledContent>
        </Container>
      </StyledRoot>
    </>
  );
}
