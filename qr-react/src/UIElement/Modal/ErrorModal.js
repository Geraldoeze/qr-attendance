import React from 'react';
import {
  Button,
  Container,
  Typography,
  Stack,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

const ErrorModal = ({ open, onClose, error, response }) => {
  const res = response ? (
    <Container>
      <Typography variant="h5">{response.statusId}</Typography>

      <Typography variant="h5">{response.message}</Typography>
    </Container>
  ) : (
    <Typography variant="h5">Something went wrong try again.!!</Typography>
  );

  

  const err = error ? (
    <Container>
      <Typography variant="h5">{error.statusId}</Typography>

      <Typography variant="h5">{error.message}</Typography>
    </Container>
  ) : (
    <Typography variant="h6">Error.!!</Typography>
  );

  return (
    <div>
      <Dialog open={!!open} onClose={onClose}>
        <DialogTitle>RESPONSE</DialogTitle>
        <DialogContent>{error ? err : res}
        <Typography variant="h6">Something went wrong try again.!!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorModal;
