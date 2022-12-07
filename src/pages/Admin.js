import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { collection, getDocs, doc, query, orderBy, limit, updateDoc, arrayUnion, where, deleteField, setDoc, arrayRemove } from 'firebase/firestore';

// @mui
import {
  Card,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  Typography,
} from '@mui/material';

import { useAuthContext } from '../auth/useAuthContext';
import { DB } from '../auth/FirebaseContext';

// components
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import ConfirmDialog from '../components/confirm-dialog';
import { useSettingsContext } from '../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../components/table';
// sections
import { UserTableRow } from '../sections/@dashboard/user/list';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'balace', label: 'Balance', align: 'left' },
  { id: 'totalPoured', label: 'Total Poured', align: 'left' },
  { id: 'isVerified', label: 'Verified', align: 'center' },
];

// ----------------------------------------------------------------------

export default function UserListPage() {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const { themeStretch } = useSettingsContext();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const { user } = useAuthContext();

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
  });

  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const isNotFound = dataFiltered.length === 0;
  
  async function getUserData() {
    // get all users from machines collection, group prop doc, users subcollection
    const q = query(collection(DB, 'machines'), where('groupName', '==', user.admin));
    // get users subcollection from above query
    const devicesSnapshot = await getDocs(q);

    const users = [];
    devicesSnapshot.forEach(async (device) => {
      const usersRef = collection(DB, 'machines', device.id, 'users');
      // wait for getDocs to complete before continuing
      const querySnapshot = await getDocs(usersRef);
      querySnapshot.forEach((doc) => {
        const userData = {
          id: doc.id,
          name: doc.data().name,
          balance: doc.data().balance || 0,
          totalPoured : doc.data().totalPoured || 0,
          weeklyPoured : doc.data().weeklyPoured || 0,
          isVerified: !doc.data().pending,
          device: [device.id],
        };
        // check if a user with a matching id already exists in the users array
        const existingUser = users.find((user) => user.id === userData.id);
        if (existingUser) {
          // update properties of existing user
          existingUser.name = userData.name;
          existingUser.balance += userData.balance;
          existingUser.totalPoured += userData.totalPoured;
          existingUser.weeklyPoured += userData.weeklyPoured;
          existingUser.isVerified = userData.isVerified;
          existingUser.device.push(userData.device[0]);
        } else {
          // add new user to the users array
          users.push(userData);
          setTableData(users);
        }
      });
    });
  }

  async function approveUsers(userIds) {
    userIds.forEach((userId) => {
      // get user data
      const individualUser = tableData.find((user) => user.id === userId);

      individualUser.device.forEach((deviceId) => {
        // remove user from pending list
        const pendingRef = doc(DB, 'machines', deviceId);
        updateDoc(pendingRef, {
          userRequests: arrayRemove(userId),
        }).then(() => {
          console.log('User removed from pending list');
        }).catch((error) => {
          console.error('Error removing user from pending list: ', error);
        });

        // add user to users collection
        const userRef = doc(DB, 'machines', deviceId, 'users', userId);
        updateDoc(userRef, {
          pending: deleteField(),
          balance: 0,
          totalPoured: 0,
          weeklyPoured: 0,
          uid: userId,
        }).then(() => {
          console.log('User approved');
        }).catch((error) => {
          console.error('Error approving user: ', error);
        });

        // add the group to users group list
        const userGroupRef = doc(DB, 'users', userId);
        updateDoc(userGroupRef, {
          groups: arrayUnion(deviceId),
        })
        
      });
    });
  }


  async function addUserData() {
    console.log('addUserData clicked');
    const getAllUsers = getDocs(collection(DB, 'users'));
    getAllUsers.then((querySnapshot) => {
      // add the first 10 users to the mac
      querySnapshot.forEach((docROW) => {
        const docRef = doc(DB, 'machines', '2Vxo79864QHhNo2q9nxc', 'users', docROW.id);
        // add 10 users to the mac
        const randNum = Math.floor(Math.random() * 10);
        if (randNum < 2) {
          setDoc(docRef, {
            name: docROW.data().displayName,
            pending: true,
          }).then(() => {
            console.log('Document successfully updated!');
          }).catch((error) => {
            console.error('Error updating document: ', error);
          })
        }
      });
    });
  }

  
  useEffect(() => {
    getUserData();
  }, []);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleApproveRows = (selected) => {
    // send to Firebase
    approveUsers(selected);

    // update table locally
    const approvedRows = tableData.filter((row) => {
      if (selected.includes(row.id)) {
        row.isVerified = true;
      }
      return row;
    });
    setSelected([]);
    setTableData(approvedRows);
  };

  return (
    <>
      <Helmet>
        <title> Manage Users | OneTap </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Typography variant="h4" sx={{ p: 3 }}>
            User List for {user.admin}
        </Typography>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <TableSelectedAction
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              action={
                <Tooltip title="Approve">
                  <IconButton color="primary" onClick={handleOpenConfirm}>
                    <Iconify icon="eva:checkmark-circle-2-outline" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                    />
                  ))}

                  <TableEmptyRows height={72} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            //
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Approve"
        content={
          <>
            Are you sure want to approve all <strong> {selected.length} </strong> users? This will not change the status of already approved users.
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleApproveRows(selected);
              handleCloseConfirm();
            }}
          >
            Confirm
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
