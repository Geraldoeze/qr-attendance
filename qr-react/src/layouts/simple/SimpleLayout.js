import { Outlet } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import FitbitIcon from '@mui/icons-material/Fitbit';
// components


// ----------------------------------------------------------------------

const StyledHeader = styled('header')(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: '100%',
  color:  '#14162F',
  position: 'absolute',
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function SimpleLayout() {
  return (
    <>
      <StyledHeader>
        <FitbitIcon  />
      </StyledHeader>

      <Outlet />
    </>
  );
}
