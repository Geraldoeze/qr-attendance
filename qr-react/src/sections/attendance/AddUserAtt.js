import { useState, useEffect } from 'react';
import { Button, Stack, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../UIElement/LoadingSpinner';
import ErrorModal from '../../UIElement/Modal/ErrorModal';



// const userIds = ['63bd99f0043aea136a38e415', '63b94fe7d3d94aa8f1dd3cde', '63bd99f0043aea136a38e415']

// const rand = userIds[Math.floor(Math.random() * userIds.length)]

const AddUserAtt = ({ value, open, onClose, updateContent }) => {
  console.log(value);
  
  const { isLoading, error, sendRequest, clearError, resMessage } = useHttpClient();
  const [token, setToken ] = useState();
  const [data, setData] = useState();

 const getTokenHandler = async () => {
  setToken("63bfb92918b006cec536f282")
  // find the user
  try {
    if (token) {
      const send = await sendRequest(`https://biometric-node.vercel.app/users/getUser/${token}`);
    setData(send.response[0]);
    }
    
  } catch (err) {
    console.log(err);
  }
};

console.log(data)

  const onSubmitHandler = async (e) => {
    const userAtt = { 
      attId: value?._id,
      department: value?.department,
      course: value?.course
    }
    
    console.log(userAtt)
    // token should be sent with the request or it could be added to the POST body
    
    if (token) {
       try {
        const sendToken = await sendRequest(`https://biometric-node.vercel.app/admin/getuserId/${token}`, 'POST', userAtt);
        console.log(sendToken);
        updateContent(sendToken.response)
        
      } catch (err) {
        console.log(err);
      }
    }
      onClose()
  };


  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} open={error} onClose={clearError} response={resMessage}  /> 
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Student Attendance</DialogTitle>
        <DialogContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" m={5}>
           { data ? <div>
             <h2>Student Id :{data?.studentId}</h2>
             <p>First Name : {data?.firstName}</p>
             <p>Last Name : {data?.lastName}</p>
           </div> : <h3>verify fingerprint</h3> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>CANCEL</Button>
          <Button onClick={getTokenHandler}>GENERATE</Button>
          <Button type="submit" onClick={onSubmitHandler}>
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddUserAtt;
