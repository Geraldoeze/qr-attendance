import { useState,  useReducer } from 'react';

import {
  Box,
  TextField,
  Checkbox,
  ListItemText,
  Typography,
  OutlinedInput,
  Stack,
  Container,
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material';



import { LoadingButton } from '@mui/lab';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';

import { useHttpClient } from '../../../hooks/http-hook';

import LoadingSpinner from '../../../UIElement/LoadingSpinner';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

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

const EditUser = ({ user, dept }) => {
  const navigate = useNavigate();

  const [course, setCourse] = useState([]);

  const [inputState, dispatch] = useReducer(inputReducer, {
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    address: user?.address,
    origin: user?.origin,
    gender: user?.gender,
    department: user?.department,
    contact: user?.contact,
    country: user?.country
  });
  console.log(user);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  console.log(inputState.firstName);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const newUserData = {
      ...inputState,
      courses: course,
      _id: user._id,
      atClass: 0,
    };
    console.log(newUserData);
    try {
      const sendEdit = await sendRequest(`https://biometric-node.vercel.app/admin/update/${user._id}`, 'PUT', newUserData);
      console.log(sendEdit);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeCourse = (event: SelectChangeEvent<typeof course>) => {
    const {
      target: { value },
    } = event;
    setCourse(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const changeHandler = (e) => {
    dispatch({
      type: 'HANDLE_INPUT',
      field: e.target.name,
      payload: e.target.value,
    });
  };

  function getCor() {
    const devo = dept?.map((val) => val.courses);
    let allCourses = [];
    for (const i in devo) {
      for (const j in devo[i]) {
        allCourses.push( `${devo[i][j]}`);
      }
    }
    return allCourses;
  }

  const allCourse = getCor();
  return (
    <>
      {isLoading && <LoadingSpinner />}

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#000080' }} variant="h6" gutterBottom>
            Update the Form below!
          </Typography>
        </Stack>
        {user ? (
          <Box sx={{ maxWidth: '30rem', alignItems: 'center' }}>
            <Box component="form" noValidate autoComplete="off" onSubmit={(e) => onSubmitHandler(e)}>
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
              <Stack direction="column" justifyContent="space-between">
                <FormControl sx={{ my: 2, width: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="gender"
                    value={inputState.gender}
                    name="gender"
                    label="gender"
                    onChange={(e) => changeHandler(e)}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={{ my: 2, minWidth: 200 }}>
                  <InputLabel id="demo-simple-select-helper-label" name="department">
                    Department
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="department"
                    name="department"
                    value={inputState.department}
                    label="Department"
                    onChange={(e) => changeHandler(e)}
                  >
                    {dept?.map((val) => {
                      return (
                        <MenuItem value={val.department} key={val._id}>
                          {val.department}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                
                <FormControl sx={{ my: 2, width: 300 }}>
                  <InputLabel id="demo-simple-select-helper-label" name="course">
                    Courses
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="courses"
                    multiple
                    value={course}
                    onChange={(e) => handleChangeCourse(e)}
                    input={<OutlinedInput label="Courses" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                   {allCourse.map((val, idx) => (
                      <MenuItem value={val} key={idx}>
                      <Checkbox checked={course.indexOf(val) > -1} />
                      <ListItemText primary={val} />
                    </MenuItem>
                    ) )}
                  </Select>
                </FormControl>
                
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
                id="origin"
                name="origin"
                label="State of Origin"
                fullWidth
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.origin}
              />
              <TextField sx={{ mb: 2 }} id="contact" name="contact" label="Phone No" fullWidth variant="outlined" onChange={(e) => changeHandler(e)} value={inputState.contact}/>
              <TextField sx={{ mb: 2 }} id="country" name="country" label="Country" fullWidth variant="outlined" onChange={(e) => changeHandler(e)} value={inputState.country}/>

              <LoadingButton variant="contained" fullWidth type="submit" sx={{ py: '0.8rem', mt: '1rem' }}>
                Submit
              </LoadingButton>
            </Box>
          </Box>
        ) : (
          ''
        )}
      </Container>
    </>
  );
};

export default EditUser;
