import {
  Box,
  TextField,
  Container,
  Typography,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

import { useContext, useState, useReducer } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

import { useHttpClient } from '../../../hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

import ErrorModal from '../../../UIElement/Modal/ErrorModal';

// initial reducer state
const inputReducer = (state, action) => {
  switch (action.type) {
    case 'HANDLE_INPUT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    case 'HANDLE_SELECT':
      return {
        ...state,
        [action.field]: action.payload,
      };
    default:
      return state;
  }
};

export default function NewAdmin() {
  const [inputState, dispatch] = useReducer(inputReducer, {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    gender: '',
    contact: '',
    title: '',
    accessLevel: '',
  });
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(inputState);
    try {
      // send  Request to create admin
      //   const sendData = await sendRequest(
      //     `${process.env.REACT_APP_BACKEND_URL}/admin/create`,
      //     "POST",
      //     inputState,
      //     {
      //       Authorization: 'Bearer ' + auth.token,
      //     }
      //   );
      //   console.log(sendData);
    } catch (err) {
      console.log(err);
    }
    navigate('/admin', { replace: true });
  };

  const changeHandler = (e) => {
    dispatch({
      type: 'HANDLE_INPUT',
      field: e.target.name,
      payload: e.target.value,
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={resMessage} />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#2065D1', my: 2 }} variant="h6" gutterBottom>
            Fill in the Form below with the right details!
          </Typography>
        </Stack>
        <Box sx={{ maxWidth: '30rem', alignItems: 'center' }}>
          <Box component="form" noValidate autoComplete="off" onSubmit={(e) => submitHandler(e)}>
            <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <TextField
                sx={{ mb: 2 }}
                id="firstName"
                label="First Name"
                name="firstName"
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.firstName}
              />
              <TextField
                sx={{ mb: 2 }}
                id="lastName"
                label="Last Name"
                name="lastName"
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.lastName}
              />
            </Stack>
            <TextField
              sx={{ mb: 2 }}
              id="email"
              label="Email"
              name="email"
              fullWidth
              variant="outlined"
              type="email"
              onChange={(e) => changeHandler(e)}
              value={inputState.email}
            />
            <TextField
              sx={{ mb: 2 }}
              id="password"
              label="Password"
              name="password"
              fullWidth
              variant="outlined"
              value={inputState.password}
              onChange={(e) => changeHandler(e)}
            />
            <Stack sx={{ mb: 2 }} direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <TextField
                sx={{ mb: 2 }}
                id="origin"
                name="origin"
                label="State of Origin"
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.origin}
              />

              <TextField
                sx={{ mb: 2 }}
                id="address"
                name="address"
                label="Address"
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.address}
              />
            </Stack>

            <TextField
              sx={{ mb: 2 }}
              id="contact"
              name="contact"
              label="Phone No"
              fullWidth
              variant="outlined"
              onChange={(e) => changeHandler(e)}
              value={inputState.contact}
            />
            <Stack sx={{ mb: 2 }} direction="row" width="100%" alignItems="center" justifyContent="space-between">
              <FormControl sx={{ mb: 2 }}>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row name="gender" value={inputState.gender} onChange={(e) => changeHandler(e)}>
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Others" control={<Radio />} label="Others" />
                </RadioGroup>
              </FormControl>

              <TextField
                sx={{ mb: 2 }}
                id="accessLevel"
                name="accessLevel"
                label="Access Level"
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.accessLevel}
              />
            </Stack>
            <TextField
              sx={{ mb: 2 }}
              id="title"
              name="title"
              label="Title"
              fullWidth
              variant="outlined"
              onChange={(e) => changeHandler(e)}
              value={inputState.title}
            />

            <LoadingButton variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem' }}>
              Update
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </>
  );
}
