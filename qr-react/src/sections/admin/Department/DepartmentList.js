import { useState, useEffect } from 'react';
import { Stack, Button, Typography, Container,  } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';


import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../UIElement/LoadingSpinner';
import ErrorModal from '../../../UIElement/Modal/ErrorModal';

import NewDepartment from './NewDepartment';
import EditDepartment from './EditDepartment';

const RandomId = 100000 + Math.floor(Math.random() * 900000);
const StyledDiv = styled('div')(() => ({
  margin: '1rem',
  backgroundColor: '#14162F',
  borderRadius: '10px',
  display: 'flex',
  color: 'grey',
  cursor: 'pointer',
}));

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));


const DepartmentList = () => {
  const [response, setResponse] = useState();
  
  const [edit, setEdit] = useState(false);
  const [editValue, setEditValue] = useState();
  const [openModal, setOpenModal] = useState(false);
  const { isLoading, sendRequest, error, clearError } = useHttpClient();

  // fetch department data
  useEffect(() => {
    const getData = async () => {
      try {
        const send = await sendRequest(`https://biometric-node.vercel.app/admin/getDept`);
        setResponse(send.response);
        
      } catch (err) {
        console.log(err);
      }
    };
    getData();
  }, []);

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
    setEditValue(val);
    setEdit(true);
  };

  // get new contents created
  const getNewState = (value) => {
    const newValue = { ...value };
    setResponse([...response, newValue]);
  };

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

  return (
    <>
     <ErrorModal error={error} onClose={clearError} response={null} open={error} /> 
      {openModal && <NewDepartment open={openModal} onClose={handleClose} updateContent={getNewState} /> }
      {edit && (
        <EditDepartment
          open={edit}
          onClose={closeEdit}
          values={editValue}
          updateContent={getEditContent}
          deleteCon={deleteContents}
        />
      )}
      <Container>
        <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
          <Typography sx={{color: '#000080'}} variant="h5">List of Department</Typography>
          <Button sx={{ mb: 1, backgroundColor: '#14162F' }} variant="outlined" onClick={handleClickOpen}>
            New Department
          </Button>
        </Stack>
        {isLoading && <LoadingSpinner asOverlay />}
        {response &&
          response?.map((val) => (
              <Container key={val._id}>
                <StyledDiv onClick={(e) => onClickHandler(e, val)}>
                  <Stack direction="column" justifyContent="space-between" sx={{ my: 2, px: 1 }}>
                    <Typography variant="h6">Department : {val.department.toUpperCase()}</Typography>
                    <Typography variant="h6">Courses : {val.courses.toString().split(',').join(', ')}</Typography>
                  </Stack>
                </StyledDiv>
              </Container>
            )
          )
        }
        {response?.length > 0 ? (
          ''
        ) : (
          <Stack direction="column" alignItems="center" justifyContent="space-between" sx={{ my: 5, p: 4 }}>
            <Typography textAlign="center" variant="h6">
              No Department{' '}
            </Typography>
          </Stack>
        )}
      </Container>
    </>
  );
};

export default DepartmentList;
