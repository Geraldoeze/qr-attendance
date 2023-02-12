import { useState, useEffect } from 'react';
import { Stack, Button, Typography, Container } from '@mui/material';

import { styled } from '@mui/material/styles';

import { useHttpClient } from '../../hooks/http-hook';
import LoadingSpinner from '../../UIElement/LoadingSpinner';

import AttenDance from './Atten-dance';
import NewAttendance from './NewAttendance';
import CloseAttendance from './CloseAttendance';
import AttendList from './AttendList';

const RandomId = 100000 + Math.floor(Math.random() * 900000);

const StyledDiv = styled('div')(({ theme }) => ({
  margin: '1rem',
  backgroundColor: '#14162F',
  borderRadius: '10px',
  display: 'flex',
  color: 'grey',
  cursor: 'pointer',
}));

const AttendanceList = () => {
  const [response, setResponse] = useState();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState();
  const [editValue, setEditValue] = useState();
  const [ refresh, setRefresh ] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  // fetch attendance data
  useEffect(() => {
    const getAttendance = async () => {
      try {
        const send = await sendRequest(`https://biometric-node.vercel.app/users/attendanceList`);
        setResponse(send.response);
        console.log(send);
      } catch (err) {
        console.log(err);
      }
    };
    getAttendance();
  }, [refresh]);

  const handleClickOpen = () => {
    setOpenModal(true);
  };
  const handleClose = () => {
    setOpenModal(false);
  };
  const closeEdit = () => {
    setEdit(false);
  };
  const onClickHandler = (e, val) => {
    console.log(val);
    setEditValue(val);
    setEdit(true);
  };

  // get new contents created
  const getNewState = (value) => {
    
    const newValue = { ...value, _id: RandomId.toString() };
    console.log(newValue)
    setRefresh(newValue);
    setResponse([...response, newValue]);
  };
  console.log(response)
  // get contents edited
  const getEditContent = (value) => {
    setResponse((response) => {
      const filtered = response?.filter((del) => del._id !== value._id);
      return [...filtered, value];
    });
  };

  // getDeletedContents
  const deleteContents = (id) => {
    setResponse((response) => response?.filter((del) => del._id !== id));
    console.log(response);
  };

  // show attendance list
  const showAttendace = (val) => {
    setValue(val);
    setOpen(true);
  };
  const closeShowAttendace = (val) => {
    setOpen(false);
  };

  return (
    <>
      {openModal && <NewAttendance open={openModal} onClose={handleClose} updateContent={getNewState} />}
      {edit && (
        <CloseAttendance
          open={edit}
          onClose={closeEdit}
          values={editValue}
          updateContent={getEditContent}
          deleteCon={deleteContents}
        />
      )}

      <Container>
        <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
          <Typography sx={{ color: '#000080' }} variant="h5">
            List of Attendance
          </Typography>
          <Button sx={{ mb: 1, backgroundColor: '#14162F' }} variant="outlined" onClick={handleClickOpen}>
            New Attendance
          </Button>
        </Stack>

        {isLoading && <LoadingSpinner asOverlay />}


        {open && <AttendList value={value} openList={open} closeList={closeShowAttendace} />}


        {response?.length > 0 ? (
          <AttenDance responseData={response} closeAtt={onClickHandler} showAtt={showAttendace} />
        ) : (
          <Stack direction="column" alignItems="center" justifyContent="space-between" sx={{ my: 5, p: 4 }}>
            <Typography textAlign="center" variant="h6">
              No Attendance{' '}
            </Typography>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default AttendanceList;
