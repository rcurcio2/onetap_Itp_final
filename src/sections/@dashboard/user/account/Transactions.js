import { Typography, Card, Button } from "@mui/material";

import { getDocs, collection, doc, updateDoc, setDoc, FieldValue } from "firebase/firestore";
import { DB } from "../../../../auth/FirebaseContext";

async function addUserData() {
  console.log('addUserData clicked');
  const getAllUsers = getDocs(collection(DB, 'users'));
  getAllUsers.then((querySnapshot) => {
    querySnapshot.forEach((docROW) => {
        const docRef = doc(DB, 'users', docROW.id, 'transactions');
        setDoc(docRef, {
          amount: 0,
          device: "pike-1",
          time: FieldValue.serverTimestamp(),
        }).then(() => {
          console.log('Document successfully updated!');
        }).catch((error) => {
          console.error('Error updating document: ', error);
        })
    });
  });
}

export default function AccountTransactions() {
  return (
    <Card sx={{ p: 3 }}> 
      <Typography variant="h5" sx={{ mb: 5 }}>
        Transactions
      </Typography>
    </Card>
  );
}