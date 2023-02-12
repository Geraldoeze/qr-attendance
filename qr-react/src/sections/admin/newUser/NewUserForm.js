import { useEffect, useState, useContext, useReducer } from 'react';

import {
  Box,
  TextField,
  Checkbox,
  ListItemText,
  Typography,
  OutlinedInput,
  Button,
  Stack,
  Container,
  FormControl,
  MenuItem,
  InputLabel,
} from '@mui/material';

import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useNavigate, useLocation } from 'react-router-dom';

import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';

import Modal from '../../../UIElement/Modal/Modal';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
import ErrorModal from '../../../UIElement/Modal/ErrorModal';



// create matric number
const RandomId = 100000 + Math.floor(Math.random() * 900000);
const matricYear = new Date().getFullYear();

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
    default:
      return state;
  }
};

const NewUserForm = ({ dept }) => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [ninNumber, setNinNumber] = useState('');
  const [level, setLevel] = useState('');
  const [sex, setSex] = useState('');
  const [depart, setDepart] = useState('');
  const [disable, setDisable] = useState(true);
  const [course, setCourse] = useState([]);

  const [inputState, dispatch] = useReducer(inputReducer, {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    origin: '',
    contact: '',
    country: '',
  });

  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const matric = getMatricNo();
    const newUserData = {
      ...inputState,
      gender: sex,
      department: depart,
      courses: course,
      levelId: level,
      matric,
      ninNumber,
    };
    try {
      const send = await sendRequest(`https://biometric-node.vercel.app/users/create`, 'POST', newUserData);
      console.log(send);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (event: SelectChangeEvent) => {
    setSex(event.target.value);
  };
  const handleChangeDept = (event: SelectChangeEvent) => {
    setDepart(event.target.value);
  };
  const selectLevel = (e) => {
    setLevel(e.target.value);
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

  const verifyNinHandler = () => {
    setDisable(false);
  };

  const getMatricNo = () => {
    if (level === '100') {
      return `${matricYear}/1/${RandomId}`;
    }
    if (level === '200') {
      return `${matricYear}/2/${RandomId}`;
    }
    return `${matricYear}/0/${RandomId}`;
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
  console.log(getCor())

  const allCourse = getCor();

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={resMessage} />
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ color: '#000080' }} variant="h6" gutterBottom>
            Complete the Form below!
          </Typography>
        </Stack>
        {dept?.length >= 1 ? (
          <Box sx={{ maxWidth: '30rem', alignItems: 'center' }}>
            <Box component="form" noValidate autoComplete="off" onSubmit={(e) => onSubmitHandler(e)}>
              <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
                <TextField
                  sx={{ mb: 2 }}
                  id="firstName"
                  name="firstName"
                  label="First Name"
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
                  <InputLabel id="demo-simple-select-helper-label" name="gender">
                    Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={sex}
                    label="sex"
                    onChange={handleChange}
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
                    value={depart}
                    label="Department"
                    onChange={handleChangeDept}
                  >
                    {dept?.map((val) => (
                      <MenuItem value={val.department} key={val._id}>
                        {val.department}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ my: 2, width: 300 }}>
                  <InputLabel id="demo-simple-select-helper-label" name="course">
                    Courses
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="course"
                    multiple
                    value={course}
                    onChange={handleChangeCourse}
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

              <FormControl sx={{ my: 2, width: 200 }}>
                <InputLabel id="demo-simple-select-helper-label" name="level">
                  Level
                </InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="leevel"
                  value={level}
                  label="level"
                  onChange={selectLevel}
                >
                  <MenuItem value="100">100</MenuItem>
                  <MenuItem value="200">200</MenuItem>
                </Select>
              </FormControl>

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
                id="country"
                name="country"
                label="Country"
                fullWidth
                variant="outlined"
                onChange={(e) => changeHandler(e)}
                value={inputState.country}
              />

              <Stack direction="column" width="100%">
                <Stack direction="row" width="100%" alignItems="center" justifyContent="space-between">
                  <TextField
                    sx={{ mb: 2, width: 300 }}
                    id="ninNumber"
                    name="ninNumber"
                    label="NIN"
                    fullWidth
                    variant="outlined"
                    value={''}
                  />
                  <Button size="small" onClick={verifyNinHandler} variant="contained">
                    Verify NIN
                  </Button>
                </Stack>
                <Typography variant="h6">
                  {/* { nin?.response} */}
                  response after nin verification failed
                </Typography>
              </Stack>

              <Button variant="contained" fullWidth type="submit" disabled={disable} sx={{ py: '0.8rem', mt: '1rem' }}>
                Submit
              </Button>
            </Box>
          </Box>
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="space-between" my={2}>
            <Typography variant="h6" gutterBottom>
              No Department Exist for Now, Create Department First. Try again later.
            </Typography>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default NewUserForm;
