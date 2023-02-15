import { useState, useReducer, useEffect } from 'react';
import {
  Button,
  TextField,
  
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import PropTypes  from 'prop-types';

import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
import ErrorModal from '../../../UIElement/Modal/ErrorModal';

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

EditDepartment.propTypes = {
  updateContent: PropTypes.func,
  deleteCon: PropTypes.func,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  values: PropTypes.object
};



export default function EditDepartment({ values, open, onClose, updateContent, deleteCon }) {
  //   const [open, setOpen] = useState(false);

  const [course, setCourse] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    // Refresh the page
    setCourse(values.courses);
    console.log('');
  }, []);

  const [inputState, dispatch] = useReducer(inputReducer, {
    department: values ? values?.department : '',
    _id: values._id,
  });

  const changeHandler = (e) => {
    dispatch({
      type: 'HANDLE_INPUT',
      field: e.target.name,
      payload: e.target.value,
    });
  };

  const editHandler = async () => {
    const newDepartmentData = { ...inputState, courses: course };
    if (newDepartmentData?.courses?.length >= 1) {
      updateContent(newDepartmentData);
    }

    try {
      const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/editDept/${inputState._id}`, 'PUT', newDepartmentData);
      console.log(send);
    } catch (err) {
      console.log(err);
    }
    onClose();
  };

  const deleteHandler = async () => {
    deleteCon(values._id);

    const deleteDept = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/deleteDept/${values._id}`, 'DELETE');
    console.log(deleteDept);
    onClose();
  };

  return (
    <div>
      { isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClose={clearError} response={null} open={error} /> 
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Edit OR Delete Department</DialogTitle>
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
            sx={{ m: 1, width: 400 }}
            id="course"
            name="courses"
            label="Courses"
            fullWidth
            variant="outlined"
            onChange={(e) => setCourse([e.target.value])}
            value={course}
          />

          
        </DialogContent>
        <DialogActions>
          <Button onClick={editHandler}>EDIT</Button>
          <Button type="submit" onClick={deleteHandler}>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
