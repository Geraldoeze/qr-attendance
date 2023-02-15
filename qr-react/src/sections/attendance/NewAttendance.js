import React, { useState, useReducer, useEffect, useContext } from 'react';
import {
  Button,
  OutlinedInput,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../UIElement/LoadingSpinner';

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

const NewAttendance = ({ open, onClose, updateContent }) => {
  const now = dayjs();
  const [date, setDate] = useState(now);
  const [dept, setDept] = useState();
  const [course, setCourse] = useState('');
  const [depart, setDepart] = useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const [inputState, dispatch] = useReducer(inputReducer, {
    lecturer: auth?.userDetails.name,
    time: '',
    attValue: 'open',
    attendance: []
  });

  // fetch department data
  useEffect(() => {
    const getData = async () => {
      try {
        const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/getDept`);
        setDept(send.response);
        console.log(send);
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

  const onSubmitHandler = async () => {
    const refinedDate = date.toDate().toString().slice(0, 25);
    const newDepartmentData = { ...inputState, refinedDate };
    
   
    try {
      const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/attendance`, 'POST', newDepartmentData);
      console.log(send);
      if (newDepartmentData?.course?.length >= 1) {
        updateContent(newDepartmentData);
      }
    } catch (err) {
      console.log(err);
    }
    onClose();
  };

  const changeHandler = (e) => {
    dispatch({
      type: 'HANDLE_INPUT',
      field: e.target.name,
      payload: e.target.value,
    });
  };

  // const handleChangeDept = (event) => {
  //   setDepart(event.target.value);
  // };

  const handleChangeCourse = (event) => {
    setCourse([event.target.value]);
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
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create Attendance</DialogTitle>
        <DialogContent>
          <Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Current Date"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
           
            
              
            
            <TextField
              autoFocus
              sx={{ m: 1, width: 350 }}
              name="time"
              id="time"
              label="Time of Service"
              type="text"
              value={inputState.time}
              onChange={(e) => changeHandler(e)}
              size="medium"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" onClick={onSubmitHandler}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewAttendance;
