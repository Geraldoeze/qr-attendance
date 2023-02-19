import { Helmet } from 'react-helmet-async';

// @mui
import { styled } from '@mui/material/styles';
import { Link, Container,  Typography, Stack } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components

// sections

import { SignUpForm } from '../sections/auth/signUp';

// ----------------------------------------------------------------------


const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 750,
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


const NewUserPage = () => {

  return (
    <>
      <Helmet>
        <title> New Member </title>
      </Helmet>

      
      <StyledRoot>
        <StyledSection>
          <Container maxWidth="sm">
          <Typography sx={{color: '#FF0000'}} variant="h4" gutterBottom>
              New Minister
            </Typography>
          <StyledContent>

        <SignUpForm />
        
        </StyledContent>
        </Container>
        </StyledSection>
      </StyledRoot>
      
    </>
  );
};

export default NewUserPage;

