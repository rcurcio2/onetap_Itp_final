import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
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
  return (
    <>
      <Helmet>
        <title>Profile | {user?.displayName}</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Account Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AccountGeneral />
          </Grid>
          <Grid item xs={12}>
            <AccountTransactions />
          </Grid>
          
        </Grid>
      </Container>
    </>
  );
}
