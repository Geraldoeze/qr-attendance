import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Checkbox, Typography, Stack } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components

// sections
import  {LoginForm} from '../sections/auth/login';
import { SignUpForm } from '../sections/auth/signUp';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '50vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(0.2, 0),
}));

const StyledDiv = styled('div')(({theme}) => ({
  margin: '0',
  display: 'flex',
  
}));

// ----------------------------------------------------------------------

export default function LoginPage() {
  const [switchPage, setSwitchPage] = useState(false);

  const mdUp = useResponsive('up', 'md');
  const switchPageHandler = () => {
    setSwitchPage((prev) => !prev);
  };

  return (
    <>
      <Helmet>
        <title> {switchPage ? 'Signup' : 'Login'} </title>
      </Helmet>

      

      <StyledDiv>
     
     
        <Container maxWidth="sm">
          <StyledContent>
            <Typography sx={{color: '#2065D1'}} variant="h4" gutterBottom>
              {switchPage ? 'Signup' : 'Login'}
            </Typography>

            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />
              
            
            {switchPage ? <SignUpForm /> : <LoginForm />}
            <Stack direction="row" alignItems="end" justifyContent="space-between" sx={{ my: 2 }}>
            <Link href='#' variant="subtitle2" underline="hover" onClick={switchPageHandler}>
                {switchPage ? 'Login' : 'Signup'}
              </Link>
              {!switchPage && <Link href='forgotPassword' variant="subtitle2" underline="hover">
                  Forgot password?
                  </Link> }
        
            </Stack>
          </StyledContent>
        </Container>
      </StyledDiv>
    </>
  );
}
