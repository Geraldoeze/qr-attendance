import { Button, Typography, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../UIElement/LoadingSpinner';

const CloseAttendance = ({ open, onClose, values, updateContent }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const closeHandler = async () => {
    const id = values?._id;
    const newVal = { ...values, attValue: 'close'};
    const newValue = {...values}
    updateContent(newVal);
    const send = await sendRequest(`http://localhost:7000/users/closeAtt/${id}`, 'PATCH', newValue);

    onClose();
  };

  return (
    <div>
      {isLoading && <LoadingSpinner overlay />}
      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{ color: '#000080' }}>Close Attendance</DialogTitle>
        <DialogContent>
          <Stack>
            <Typography sx={{ color: '#000080' }} variant="h5" gutterBottom>
              Are you sure you want to close {values?.department} Attendance?
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CANCEL</Button>
          <Button type="submit" onClick={closeHandler}>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CloseAttendance;
