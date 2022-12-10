import { useState, useEffect } from "react";

import { Typography, Card, Box, Avatar, TableContainer, Table, TableRow, TableHead, TableBody, TableCell } from "@mui/material";
import { format } from 'date-fns';
import { getDocs, collection, orderBy, limit, query } from "firebase/firestore";
import { fCurrency } from '../../../../utils/formatNumber';
import Iconify from '../../../../components/iconify';
import { DB } from "../../../../auth/FirebaseContext";

async function getUserTransactions(uid) {
  const transactionsRef = collection(DB, "users", uid, "transactions");
  const q = query(transactionsRef, limit(30), orderBy("time", "desc"));
  const querySnapshot = await getDocs( q );
  const transactions = [];
  querySnapshot.forEach((doc) => {
    transactions.push({
      id: doc.id,
      amount: doc.data().amount,
      date: doc.data().time ? format(doc.data().time.toDate(), "MM/dd/yyyy") : "-",
      time: doc.data().time ? format(doc.data().time.toDate(), "h:mm a") : "-",
      type: doc.data().type || "pour",
      oz: doc.data().oz || "-",
      device: doc.data().device || "-",
    });
  });
  return transactions;
}



export default function AccountTransactions(props) {
  const [transactions, setTransactions] = useState([]);
  const { id } = props;

  useEffect(() => {
    if (id) {
      getUserTransactions(id).then((transactions) => {
        setTransactions(transactions);
      });
    }
    
  }, [id]);

  return (
    <Card sx={{ p: 3 }}> 
      <Typography variant="h5" sx={{ mb: 5 }}>
          Transactions
      </Typography>
      <TableContainer sx={{ overflow: 'unset' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell sx={{ display: { xs: 'none', md: 'block' } }}>Oz</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ position: 'relative',  display: { xs: 'none', md: 'block' } }}>
                          {renderAvatar(row.type)}
                        <Box
                          sx={{
                            right: 0,
                            bottom: 0,
                            width: 18,
                            height: 18,
                            display: 'flex',
                            borderRadius: '50%',
                            position: 'absolute',
                            alignItems: 'center',
                            color: 'common.white',
                            bgcolor: 'error.main',
                            justifyContent: 'center',
                            ...(row.type === 'pour' && {
                              bgcolor: 'success.main',
                            }),
                          }}
                        >
                          <Iconify
                            icon={
                              row.type === 'pour' ? 'eva:diagonal-arrow-right-up-fill' : 'eva:diagonal-arrow-left-down-fill'
                            }
                            width={16}
                          />
                        </Box>
                      </Box>
                      <Box sx={{ ml: { xs: 0, md: 2 } }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {row.type === 'pour' ? 'Pour at' : 'Payment for'}
                        </Typography>
                        <Typography variant="subtitle2"> {row.device}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="subtitle2">{row.date}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {row.time}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{align: 'right'}}>{fCurrency(row.amount)}</TableCell>
                  <TableCell sx={{ display: { xs: 'none', md: 'block' } }}>{row.oz}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </TableContainer>
    </Card>
  );
}

function AvatarIcon({ icon }) {
  return (
    <Avatar
      sx={{
        width: 48,
        height: 48,
        color: 'text.secondary',
        bgcolor: 'background.neutral',
      }}
    >
      <Iconify icon={icon} width={24} />
    </Avatar>
  );
}

function renderAvatar(category) {
  if (category === 'pour') {
    return <AvatarIcon icon="eva:droplet-fill" />;
  }
  if (category === 'payment') {
    return <AvatarIcon icon="eva:credit-card-fill" />;
  } 

  return <AvatarIcon icon="eva:droplet-fill" />;
}
