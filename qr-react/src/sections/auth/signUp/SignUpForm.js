import {
  Box,
  TextField,
  Container,
  Typography,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { useHttpClient } from '../../../hooks/http-hook';

import ErrorModal from '../../../UIElement/Modal/ErrorModal';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
import { InputState } from './signUpDetails';

const SignUpForm = () => {
  const navigate = useNavigate();
  const now = dayjs();
  const [value, setValue] = useState(now);

  const [formValues, setFormValues] = useState(InputState);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgError, setImgError ] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
      setImgError(false);
    }
  }, [selectedImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: {
        ...formValues[name],
        value,
        error: false,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // get actual date
    const refinedDate = value?.toDate().toString().slice(0, 16);

    const formFields = Object.keys(formValues);
    let newFormValues = { ...formValues };
    for (let index = 0; index < formFields.length; index++) {
      const currentField = formFields[index];
      const currentValue = formValues[currentField].value;

      if (currentValue === '') {
        newFormValues = {
          ...newFormValues,
          [currentField]: {
            ...newFormValues[currentField],
            error: true,
          },
        };
        
      }
      
    }
    setFormValues(newFormValues);
    try {
      const formDataSend = new FormData()
      formDataSend.append('email', formValues.email.value);
      formDataSend.append('lastName', formValues.lastName.value);
      formDataSend.append('firstName', formValues.firstName.value);
      formDataSend.append('password', formValues.password.value);
      formDataSend.append('area', formValues.area.value);
      formDataSend.append('address', formValues.address.value);
      formDataSend.append('gender', formValues.gender.value);
      formDataSend.append('contact', formValues.contact.value);
      formDataSend.append('status', formValues.status.value);
      formDataSend.append('origin', formValues.origin.value);
      formDataSend.append('image', selectedImage);
      formDataSend.append('dob', refinedDate);
      
      if(!selectedImage) {
       return setImgError(true)
      }
      if (!(formValues.email.error) && !(formValues.lastName.error) && !(formValues.password.error) && !!selectedImage){
      
      // send Request to create user
      const sendData = await sendRequest(process.env.REACT_APP_BACKEND_URL+"/users/create", "POST", formDataSend);
      console.log(sendData);
      navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.log(err)
    }
    
  };

  
  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={resMessage} />
     
      
        <form noValidate onSubmit={handleSubmit}>
          <Typography sx={{ marginY: '1rem', color: '#2065D1' }} variant="h5">
            Please enter your data
          </Typography>

          <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
            <TextField
              sx={{ mb: 2 }}
              id="firstName"
              name="firstName"
              label="First Name"
              variant="outlined"
              value={formValues.firstName.value}
              onChange={handleChange}
              error={formValues.firstName.error}
              helperText={formValues.firstName.error ? formValues.firstName.errorMessage : ''}
            />
            <TextField
              sx={{ mb: 2 }}
              id="lastName"
              label="Last Name"
              name="lastName"
              variant="outlined"
              value={formValues.lastName.value}
              onChange={handleChange}
              error={formValues.lastName.error}
              helperText={formValues.lastName.error ? formValues.lastName.errorMessage : ''}
            />
          </Stack>

          <TextField
            sx={{ mb: 2 }}
            id="email"
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            value={formValues.email.value}
            onChange={handleChange}
            error={formValues.email.error}
            helperText={formValues.email.error ? formValues.email.errorMessage : ''}
          />
          <TextField
            sx={{ mb: 2 }}
            id="password"
            label="Password"
            name="password"
            fullWidth
            variant="outlined"
            value={formValues.password.value}
            onChange={handleChange}
            error={formValues.password.error}
            helperText={formValues.password.error ? formValues.password.errorMessage : ''}
          />
          <TextField
            sx={{ mb: 2 }}
            id="contact"
            label="Contact Number"
            name="contact"
            fullWidth
            variant="outlined"
            value={formValues.contact.value}
            onChange={handleChange}
            error={formValues.contact.error}
            helperText={formValues.contact.error ? formValues.contact.errorMessage : ''}
          />

          <Stack sx={{ mb: 2 }} direction="row" width="100%" alignItems="center" justifyContent="space-between">
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup row name="gender" value={formValues.gender.value} onChange={handleChange}>
                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                <FormControlLabel value="Others" control={<Radio />} label="Others" />
              </RadioGroup>
            </FormControl>
            <TextField
              sx={{ mb: 2 }}
              id="origin"
              label="State of Origin"
              name="origin"
              variant="outlined"
              value={formValues.origin.value}
              onChange={handleChange}
              error={formValues.origin.error}
              helperText={formValues.origin.error ? formValues.origin.errorMessage : ''}
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

            <FormControl sx={{ mb: 2, ml: 8   }}>
              <FormLabel>Status</FormLabel>
              <RadioGroup row name="status" value={formValues.status.value} onChange={handleChange}>
                <FormControlLabel value="Single" control={<Radio />} label="Single" />
                <FormControlLabel value="Married" control={<Radio />} label="Married" />
                <FormControlLabel value="Others" control={<Radio />} label="Others" />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Stack marginY="1rem" direction="column" width="100%">
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
                  Upload Image
                </Button>
              </label>
            </Container>
            {imgError && <div style={{color:"red", padding:'1rem'}}>Kindly Upload Image..</div>}
            {imageUrl && selectedImage && (
              <Box m={2}>
                <div>Image Preview:</div>
                <img src={imageUrl} alt={selectedImage.name} height="100px" />
              </Box>
            )}
          </Stack>

          <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
            <TextField
              sx={{ mb: 2 }}
              id="area"
              name="area"
              label="Area"
              variant="outlined"
              value={formValues.area.value}
              onChange={handleChange}
              error={formValues.area.error}
              helperText={formValues.area.error ? formValues.area.errorMessage : ''}
            />
            <TextField
              sx={{ mb: 2 }}
              id="address"
              label="Address"
              name="address"
              variant="outlined"
              value={formValues.address.value}
              onChange={handleChange}
              error={formValues.address.error}
              helperText={formValues.address.error ? formValues.address.errorMessage : ''}
            />
          </Stack>

          <Button variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem' }}>
            Submit
          </Button>
        </form>
      
    </>
  );
};

export default SignUpForm;
