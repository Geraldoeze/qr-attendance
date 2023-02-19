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
  const [event, setEvent] = useState('');
  const [allEvent, setAllEvent] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const auth = useContext(AuthContext);
  const [inputState, dispatch] = useReducer(inputReducer, {
    creator: auth?.userDetails.firstName,
    access: auth?.userDetails.type,
    time: '',
    place: '',
    attendance: [],
  });

  // fetch event data
  useEffect(() => {
    const getEvent = async () => {
      // try {
      //   const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/getDept`);
      //   setAllEvent(send.response);
      //   console.log(send);
      // } catch (err) {
      //   console.log(err);
      // }
    };
    // getData();
  }, []);

  const onSubmitHandler = async () => {
    const refinedDate = date.toDate().toString().slice(0, 16);
    const newAttData = { ...inputState, refinedDate, attValue: 'Open' };

    try {
      const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/attendance/create`, 'POST', JSON.stringify(newAttData),
      {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + auth.token,
      }
      );
      console.log(send);
    
      if (newAttData?.place?.length >= 1) {
        updateContent(newAttData);
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



  const handleChangeEvent = (event) => {
    setCourse([event.target.value]);
  };

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create Attendance for an Event</DialogTitle>
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

            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="demo-simple-select-helper-label" name="event">
                Select Event 
              </InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="event"
                label="Event"
                value={event}
                
                onChange={handleChangeEvent}
                input={<OutlinedInput label="Courses" />}
              >
                {allEvent?.map((val, idx) => (
                  <MenuItem value={val} key={idx}>
                    <Checkbox checked={course.indexOf(val) > -1} />
                    <ListItemText primary={val} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
            <TextField
              autoFocus
              sx={{ m: 1, width: 350 }}
              name="place"
              id="place"
              label="Place of Service"
              type="text"
              value={inputState.place}
              onChange={(e) => changeHandler(e)}
              size="medium"
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" sx={{color: '#FF0000'}} onClick={onSubmitHandler}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewAttendance;
