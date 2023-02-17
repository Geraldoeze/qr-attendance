import {
  Box,
  TextField,
  Container,
  Typography,
  InputLabel,
  MenuItem,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { useContext, useState, useReducer } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

import { useHttpClient } from '../../../hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';

import LoadingSpinner from '../../../UIElement/LoadingSpinner';
import ErrorModal from '../../../UIElement/Modal/ErrorModal';

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

export default function EditAdmin({ user }) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    address: user?.address,
    contact: user?.contact,
    gender: user?.gender,
    contact: user?.contact,
    title: user?.title,
  });
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [accessLevel, setAccessLevel] = useState(user?.accessLevel);

  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();

  const adminId = user?._id;
  const submitHandler = async (e) => {
    e.preventDefault();
    const editData = { ...inputState, accessLevel };
    try {
      // send  Request to update admin
      const sendData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/admin/update/${adminId}`,
        'PUT',
        JSON.stringify(editData),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      console.log(sendData);
    } catch (err) {
      console.log(err);
    }
    navigate('/admin', { replace: true });
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAccessLevel(event.target.value);
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
      <StyledRoot>
        <StyledSection>
          <Container>
            <Stack sx={{ maxWidth: '32rem', alignItems: 'center', margin: 'auto' }}>
              <Typography sx={{ color: '#2065D1', my: 2 }} variant="h6" gutterBottom>
                Update the Form below with the right details!
              </Typography>
            </Stack>
            <Box sx={{ maxWidth: '32rem', alignItems: 'center', margin: 'auto' }}>
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

                <Stack sx={{ mb: 2 }} direction="row" width="100%" alignItems="center" justifyContent="space-between">
                  <TextField
                    sx={{ mb: 2 }}
                    id="contact"
                    name="contact"
                    label="Phone No"
                    variant="outlined"
                    onChange={(e) => changeHandler(e)}
                    value={inputState.contact}
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

                <Stack sx={{ mb: 2 }} direction="row" width="100%" alignItems="center" justifyContent="space-between">
                  <FormControl sx={{ mb: 2 }}>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup row name="gender" value={inputState.gender} onChange={(e) => changeHandler(e)}>
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      <FormControlLabel value="Others" control={<Radio />} label="Others" />
                    </RadioGroup>
                  </FormControl>

                  <Box sx={{ minWidth: 180 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Access Level</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={accessLevel}
                        label="Access Level"
                        onChange={handleChange}
                      >
                        <MenuItem value="Junior">Junior</MenuItem>
                        <MenuItem value="Intermediate">Intermediate</MenuItem>
                        <MenuItem value="Professional">Professional</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
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
        </StyledSection>
      </StyledRoot>
    </>
  );
}
