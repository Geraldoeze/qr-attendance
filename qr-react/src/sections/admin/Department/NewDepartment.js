import { useState, useReducer, useEffect } from 'react';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';


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

const RandomId = 100000 + Math.floor(Math.random() * 900000);

const NewDepartment = ({ open, onClose, updateContent }) => {
  const [course, setCourse] = useState('');
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [inputState, dispatch] = useReducer(inputReducer, {
    department: '',

  });

  useEffect(() => {
    // Refresh the page
  }, []);
  const onSubmitHandler = async (e) => {
    const arrCourse = course.split(',')
    const arrC = arrCourse.map((val) => {
      const newVal = val.trim()
      return newVal
    })
    const newDepartmentData = { ...inputState, courses: arrC };
    if (newDepartmentData?.courses?.length >= 1) {
      const newCourse = {...newDepartmentData, _id: RandomId.toString() }
      updateContent(newCourse);
    }
    try {
      const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/createData`, 'POST', newDepartmentData);
      console.log(send);
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

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            sx={{ m: 1, width: 350 }}
            name="department"
            id="department"
            label="Department"
            type="text"
            value={inputState.department}
            onChange={(e) => changeHandler(e)}
            size="small"
            variant="filled"
          />
          <TextField
            size="small"
            variant="filled"
            sx={{ m: 1, width: 400 }}
            id="course"
            name="courses"
            label="Create multiple Courses"
            fullWidth
            variant="outlined"
            onChange={(e) => setCourse(() => e.target.value)}
            value={course}
          />
         
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

export default NewDepartment;
