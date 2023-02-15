import PropTypes from 'prop-types';
import { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Button, Drawer, Typography, Avatar, Stack, IconButton } from '@mui/material';
import FitbitIcon from '@mui/icons-material/Fitbit';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// hooks
import useResponsive from '../../../hooks/useResponsive';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import NavSection from '../../../components/nav-section';
import { AuthContext } from '../../../context/auth-context';
//
import NavConfig from './config';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const { pathname } = useLocation();
  const auth = useContext(AuthContext);
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const iconImage = '' || <AccountCircleIcon />;

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <FitbitIcon />
      </Box>
      {auth.isLoggedIn && (
      <Box sx={{ mb: 2, mx: 1 }}>
        <Link underline="none">
          <StyledAccount>
            {/* <Avatar src={<AccountCircleIcon/>} alt="photoURL" /> */}
            <IconButton sx={{ mt: '0.3rem' }}>
              <AccountCircleIcon fontSize="large" />
            </IconButton>

            <Box sx={{ ml: 2 }}>
              <Typography variant="h5" sx={{ color: 'text.primary' }}>
                {auth.userDetails?.firstName}
              </Typography>

              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {auth.userDetails?.type}
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>
      )}
      <NavSection data={NavConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: NAV_WIDTH },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
