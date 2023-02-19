import { filter } from 'lodash';

import { useState, useContext } from 'react';
import { AuthContext } from '../../context/auth-context';

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
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components

import Iconify from '../../components/iconify';
import { v4 as uuidv4 } from "uuid";
import Scrollbar from '../../components/scrollbar';
// sections

import { UserListHead, UserListToolbar } from '../dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'creator', label: 'Creator', alignItems: true },
  { id: 'event', label: 'Event', alignItems: true },
  { id: 'time', label: 'Time/Date', alignItems: true },
  { id: 'place', label: 'Place', alignitems: true },
  { id: 'access', label: 'AccessLevel', alignitems: true },
  { id: 'current', label: 'Current', alignItems: true },
  { id: 'addMember', label: 'Members', alignItems: true },
  { id: 'deleteAtt', label: 'Attendance', alignItems: true },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis?.map((el) => el[0]);
}

export default function AttenDance({ responseData, closeAtt, showAtt, deleteAtt }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('event');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const auth = useContext(AuthContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = responseData.map((n) => n.creator);
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

  const userHandler = (e, val) => {
    if (val.attValue === 'Open') {
      closeAtt(e, val);
    }
  };

  const deleteAttHandler = (e, attId) => {
    deleteAtt(attId)
  }

  const showAttHandler = (e, val) => {
    showAtt(val);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - responseData.length) : 0;

  const filteredUsers = applySortFilter(responseData, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers?.length && !!filterName;

  return (
    <>
      <Container>
        <Card>
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
                    const { _id, creator, event, time, place, access, refinedDate, attValue, attendance } = row;
                    const selectedUser = selected.indexOf(event) !== -1;

                    return (
                      <TableRow hover key={uuidv4} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} /> */}
                        </TableCell>

                        <TableCell component="th" alignitems="center" scope="row" padding="normal">
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography
                              sx={{ cursor: 'pointer' }}
                              variant="subtitle2"
                              noWrap
                              onClick={(e) => showAttHandler(e, row)}
                            >
                              {creator}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell sx={{ cursor: 'pointer' }} align="center" onClick={(e) => showAttHandler(e, row)}>
                          {event}
                        </TableCell>

                        <TableCell align="center">{time}, {refinedDate} </TableCell>

                        <TableCell align="center">{place}</TableCell>

                        <TableCell align="center">{access}</TableCell>

                        <TableCell sx={{ cursor: 'pointer', color: 'blue', fontWeight: 'bold' }} align="right" onClick={(e) => userHandler(e, row)}>
                          {attValue}
                        </TableCell>

                        <TableCell sx={{ cursor: 'pointer' }} align="center">
                          {attendance?.length}
                        </TableCell>
                        <TableCell sx={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }} align="center" onClick={(e) => deleteAttHandler(e, row._id)}>
                          Delete
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
    </>
  );
}
