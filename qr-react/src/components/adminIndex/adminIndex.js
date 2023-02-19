import { filter } from 'lodash';

import { useState } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  IconButton,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import { v4 as uuidv4 } from "uuid";
// components

import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstname', label: 'First Name', alignItems: true },
  { id: 'lastname', label: 'Last Name', alignItems: true },
  { id: 'gender', label: 'Gender', alignItems: true },
  { id: 'access', label: 'AccessLevel', alignItems: true },
  { id: 'title', label: 'Title', alignItems: true },
  { id: 'contact', label: 'Contact', alignItems: true },
  { id: 'address', label: 'Address', alignItems: true },
  {id: ''}
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

AdminIndex.propTypes = {
  responseData: PropTypes.array,
};


export default function AdminIndex({ responseData, deleteUser }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('firstname');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [ userInfo, setUserInfo ] = useState(null);

  const handleOpenMenu = (event, id) => {
    setUserInfo(id);
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = responseData.map((n) => n.firstName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    console.log(event)
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEditHandler = () => {
    navigate(`/admin/profile/${userInfo}`, { replace: true });
  }

  const handleProfileHandler = () => {
    navigate(`/admin/profile/${userInfo}`, {replace: true});
  }

  const handleDeleteHandler = async () => {
    deleteUser(userInfo)
    setOpen(null);
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - responseData.length) : 0;

  const filteredUsers = applySortFilter(responseData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;
  
  return (
    <>
      <Container>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={responseData?.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, firstName, lastName, title, accessLevel, gender, contact, address } = row;
                    const selectedUser = selected.indexOf(firstName) !== -1;
                    
                    return (
                      <TableRow hover key={uuidv4()} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                        </TableCell>

                        <TableCell component="th" alignitems="center" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" noWrap>
                              {firstName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="center">{lastName?.toUpperCase()}</TableCell>

                        <TableCell align="center">{gender?.toUpperCase()}</TableCell>

                        <TableCell align="center">{accessLevel}</TableCell>

                        <TableCell align="center">{title?.toUpperCase()}</TableCell>

                        <TableCell align="center">{contact}</TableCell>

                        <TableCell align="center">{address}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, _id)}>
                            <Iconify icon={'eva:more-vertical-fill'} /> 
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={responseData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem onClick={ handleProfileHandler}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={ handleEditHandler}>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={ handleDeleteHandler } sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
