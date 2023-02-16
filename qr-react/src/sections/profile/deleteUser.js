import { useContext } from 'react';
import { Button, Typography, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import LoadingSpinner from '../../UIElement/LoadingSpinner';
import ErrorModal from '../../UIElement/Modal/ErrorModal';

const DeleteUser = ({ open, onClose, userId }) => {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();
  
  const deleteUserHandler = async () => {
    try {
      const deleteAccount = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/admin/delete/${userId}`, 'DELETE', null,
        {
            Authorization: 'Bearer ' + auth.token
        }
      );
      console.log(deleteAccount);
      navigate('/dashboard', {replace: true});
      auth.logout();
      onClose()
    } catch(err) {
      console.log(err);
    }
    
  }

  return (
    <div>
      {isLoading && <LoadingSpinner overlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={resMessage} />

      <Dialog open={open} onClose={onClose}>
        <DialogTitle sx={{color: '#ff4382'}}>Delete Account</DialogTitle>
        <DialogContent>
          <Stack>
            <Typography sx={{ color: '#000080' }} variant="h5" gutterBottom>
              Are you sure you want to delete your Account? This will remove your Account from our Database..
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CANCEL</Button>
          <Button sx={{color: '#ff4382'}} type="submit" onClick={deleteUserHandler}>
            DELETE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteUser;
