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
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components

// import Iconify from '../iconify';
import Scrollbar from '../scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../../sections/dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'firstname', label: 'First Name', alignItems: true },
  { id: 'lastname', label: 'Last Name', alignItems: true },
  { id: 'matric', label: 'Matric', alignItems: true },
  { id: 'department', label: 'Department', alignItems: true },
  { id: 'gender', label: 'Gender', alignItems: true },
  { id: 'level', label: 'Level', alignItems: true },
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

DashboardUser.propTypes = {
  responseData: PropTypes.array,
};

export default function DashboardUser({ responseData }) {
  const navigate = useNavigate();

  // const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('firstname');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = responseData.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const userHandler = (e, id) => {
    navigate(`/dashboard/student/${id}`, { replace: true });
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - responseData.length) : 0;

  const filteredUsers = applySortFilter(responseData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  return (
    <>
      <Container>
        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, color: '#000080' }}>
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
                  {filteredUsers?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, firstName, lastName, matric, department, gender, levelId } = row;
                    const selectedUser = selected.indexOf(firstName) !== -1;
                    const dept = department.toUpperCase();
                    return (
                      <TableRow
                        hover
                        key={_id}
                        
                        tabIndex={-1}
                        role="checkbox"
                        selected={selectedUser}
                        onClick={(e) => userHandler(e, _id)}
                      >
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} /> */}
                        </TableCell>

                        <TableCell component="th" alignitems="center" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="subtitle2" noWrap>
                              {firstName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="center">{lastName}</TableCell>

                        <TableCell align="center">{matric}</TableCell>

                        <TableCell align="center">{dept}</TableCell>

                        <TableCell align="center">{gender}</TableCell>

                        <TableCell align="center">{levelId}</TableCell>
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
      {/* <Popover
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
      <MenuItem>
        <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
        Edit
      </MenuItem>

      <MenuItem sx={{ color: 'error.main' }}>
        <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
        Delete
      </MenuItem>
    </Popover> */}
    </>
  );
}
