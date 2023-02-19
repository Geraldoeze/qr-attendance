import { Button, Typography, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth-context';

import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../UIElement/LoadingSpinner';

const CloseAttendance = ({ open, onClose, values, updateContent }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const closeHandler = async () => {
    const id = values?._id;
    const newVal = { ...values, attValue: 'Close'};
    const newValue = {...values}
    updateContent(newVal);
    const send = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/attendance/closeAtt/${id}`, "PATCH", JSON.stringify(newValue),
    {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + auth.token,
    }
    );
    console.log(send)

    onClose();
  };

  return (
    <div>
      {isLoading && <LoadingSpinner overlay />}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ color: '#900C3F' }}>Close Attendance</DialogTitle>
        <DialogContent>
          <Stack>
            <Typography sx={{ color: '#000080' }} variant="h5" gutterBottom>
              Are you sure you want to close {values?.department} Attendance?
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CANCEL</Button>
          <Button sx={{color:"#900C3F"}} type="submit" onClick={closeHandler}>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CloseAttendance;
