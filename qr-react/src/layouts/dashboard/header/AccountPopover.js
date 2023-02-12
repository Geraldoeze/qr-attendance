import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { alpha } from '@mui/material/styles';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Divider, Typography, Stack, MenuItem, IconButton, Popover } from '@mui/material';
// mocks_

// context
import { AuthContext } from '../../../context/auth-context';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleHome = () => {
    setOpen(null);
    navigate('/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setOpen(null);
    auth.logout(null);
    navigate('/auth', { replace: true });
  };

  const handleLogin = () => {
    setOpen(null);
    navigate('/auth', { replace: true });
  };

  const account = {
    displayName: auth.userDetails?.name,
    email: auth.userDetails?.email,
    emailVeri: auth.userDetails?.emailVerified,
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 1,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <AccountCircleIcon fontSize="large" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        {auth.isLoggedIn && (
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {account.displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {account.email}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              Verified : {account.emailVeri.toString()}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: 'dashed' }} />

        {auth.isLoggedIn && (
          <Stack sx={{ p: 1 }}>
            {MENU_OPTIONS.map((option) => (
              <MenuItem key={option.label} onClick={handleHome}>
                {option.label}
              </MenuItem>
            ))}
          </Stack>
        )}
        <Divider sx={{ borderStyle: 'dashed' }} />
        {auth.isLoggedIn ? (
          <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
            Logout
          </MenuItem>
        ) : (
          <MenuItem onClick={handleLogin} sx={{ m: 1 }}>
            Login
          </MenuItem>
        )}
      </Popover>
    </>
  );
}
