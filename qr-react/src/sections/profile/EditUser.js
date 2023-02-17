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
import dayjs from 'dayjs';

import ErrorModal from '../../UIElement/Modal/ErrorModal';
import LoadingSpinner from '../../UIElement/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
export default function EditUser({ user }) {
  const [inputState, dispatch] = useReducer(inputReducer, {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    address: user?.address,
    password: user?.password,
    origin: user?.origin,
    gender: user?.gender,
    status: user?.status,
    contact: user?.contact,
    image: user?.image,
    area: user?.area,
    
  });

  const navigate = useNavigate();
  const now = dayjs();
  const auth = useContext(AuthContext);
  const [value, setValue] = useState(dayjs(user?.dob));
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();

  const userId = user?._id;
  
  const submitHandler = async (e) => {
      e.preventDefault();
       // get actual date
    const refinedDate = value?.toDate().toString().slice(0, 16);

    try {
      const formDataSend = new FormData()
      formDataSend.append('email', inputState.email);
      formDataSend.append('lastName', inputState.lastName);
      formDataSend.append('firstName', inputState.firstName);
      formDataSend.append('password', inputState.password);
      formDataSend.append('area', inputState.area);
      formDataSend.append('address', inputState.address);
      formDataSend.append('gender', inputState.gender);
      formDataSend.append('contact', inputState.contact);
      formDataSend.append('status', inputState.status);
      formDataSend.append('origin', inputState.origin);
      formDataSend.append('image', selectedImage);
      formDataSend.append('dob', refinedDate);
      
        // send  Request to update user
        const sendData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/update/${userId}`, "PUT", JSON.stringify(formDataSend), 
          {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
          }
        );
        console.log(sendData);
        
      } catch (err) {
        console.log(err)
      }
      navigate("/dashboard", { replace: true });
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
          <Typography sx={{ color: '#2065D1', my:2 }} variant="h6" gutterBottom>
            Update the Form below with the right details!
          </Typography>
        </Stack>

        {user ? (
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
                id="origin"
                name="origin"
                label="State of Origin"
                fullWidth
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.origin}
              />
          </Stack>
            <Stack sx={{ mb: 2 }} direction="row" width="100%" alignItems="center" justifyContent="space-between">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date of Birth"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                  }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <FormControl sx={{ mb: 2, mx: 2 }}>
              <FormLabel>Status</FormLabel>
              <RadioGroup row name="status" value={inputState.status} onChange={(e) => changeHandler(e)}>
                <FormControlLabel value="Single" control={<Radio />} label="Single" />
                <FormControlLabel value="Married" control={<Radio />} label="Married" />
                <FormControlLabel value="Others" control={<Radio />} label="Others" />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Stack marginBottom="2rem" direction="column" width="100%">
            <Container>
              <input
                accept="image/*"
                type="file"
                id="select-image"
                style={{ display: 'none' }}
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
              <label htmlFor="select-image">
                <Button variant="contained" color="primary" component="span">
                  Upload New Image
                </Button>
              </label>
            </Container>
            {imageUrl && selectedImage && (
              <Box m={2}>
                <div>Image Preview:</div>
                <img src={imageUrl} alt={selectedImage.name} height="100px" />
              </Box>
            )}
          </Stack>

              <TextField
                sx={{ mb: 2 }}
                id="address"
                name="address"
                label="Address"
                fullWidth
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.address}
              />
            
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
              <TextField
                sx={{ mb: 2 }}
                id="area"
                name="area"
                label="Area"
                fullWidth
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.area}
              />

              <LoadingButton variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem' }}>
                Update
              </LoadingButton>
            </Box>
          </Box>
        ) : (
          ''
        )}
      </Container>
    </>
  );
}
