import { useState, useEffect, useContext } from 'react';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import ScanQRCode from '../../components/ScanQR/ScanQRCode';
import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../UIElement/LoadingSpinner';
import ErrorModal from '../../UIElement/Modal/ErrorModal';

import { AuthContext } from '../../context/auth-context';

const AddUserAtt = ({ value, open, onClose, updateContent }) => {
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();
  
  const [scan, setScan] = useState(false);
  

   const getTokenHandler = async () => {
    setScan(true)
  };

  
  const getQRtoken = async (userId) => {
    try {
      if (userId?.length >= 8) {
        // send fetch request
        const sendToken = await sendRequest( `${process.env.REACT_APP_BACKEND_URL}/users/getuser/${userId}`, "GET", null,
        {
          Authorization: 'Bearer ' + auth.token,
        }
        )
        console.log(sendToken);
        updateContent(sendToken.response);
      }
    } catch (err) {
      console.log(err);
    }

    onClose();
  };

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={resMessage} />
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Church Attendance</DialogTitle>
        <DialogContent sx={{ width: '100%', padding: '0' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" m={5}>
            {scan ? <ScanQRCode getQR={getQRtoken} /> : <h3>Scan QR Code</h3>}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CLOSE</Button>
          <Button style={{color:'red'}} onClick={getTokenHandler}>SCAN</Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddUserAtt;
