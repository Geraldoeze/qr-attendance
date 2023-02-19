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

  console.log(value)
  const getQRtoken = async (userId) => {
    
    try {
      // if (userId?.length >= 8) {
      //   const attId = value._id
      //   // send fetch request to get minister and update the attendance
      //   const sendToken =  sendRequest( `${process.env.REACT_APP_BACKEND_URL}/attendance/getminister/${userId}/${attId}`, "POST", null,
      //   {
      //     Authorization: 'Bearer ' + auth.token,
      //   }
      //   )
      //   const userDetails = sendToken?.response;
      //   console.log(userDetails)
      //   // updateContent(userDetails);
      // }
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
