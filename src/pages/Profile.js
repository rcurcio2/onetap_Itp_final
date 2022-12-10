import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

// @mui
import { Container, Grid, Typography } from '@mui/material';

import { useAuthContext } from '../auth/useAuthContext';

// sections
import {
  AccountGeneral,
  AccountTransactions,
} from '../sections/@dashboard/user/account';


// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { user } = useAuthContext();
  const { uid } = useParams();

  const [userId, setUserId] = useState(null);
  
  useEffect(() => {
    if (uid) {
      setUserId(uid);
    } else {
      setUserId(user.uid);
    }
  }, [uid, user.uid, userId]);


  return (
    <>
      <Helmet>
        <title>{uid ? "Edit Profile" : (`Profile | ${user?.displayName}`)}</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Account Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AccountGeneral id={userId} />
          </Grid>
          <Grid item xs={12}>
            <AccountTransactions id={ userId }/>
          </Grid>
          
        </Grid>
      </Container>
    </>
  );
}
