import { Grid, Typography, Button } from '@mui/material';
import { doc, onSnapshot} from '@firebase/firestore';
import { Container, Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { capitalCase } from 'change-case';
import Label from '../components/label';

import { useAuthContext } from '../auth/useAuthContext';
import { DB } from '../auth/FirebaseContext';

export default function DevicePour() {
  const { deviceName } = useParams();
  const [online, setOnline] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [userLock, setUserLock] = useState('');
  const [name, setName] = useState('');
  const [onTap, setOnTap] = useState('');
  const [cost, setCost] = useState('');

  const { user } = useAuthContext();

  useEffect(() => {
    const deviceRef = doc(DB, "machines", deviceName);
        const unsub = onSnapshot(deviceRef, (doc) => {
            setOnline(doc.data().kegOnline);
            setUserLock(doc.data().userLock);
            setPouring(doc.data().pouring);
            setName(doc.data().deviceName || '');
            setOnTap(doc.data().onTap || '');
            setCost(doc.data().costPerPint || '');
        });
    return unsub;
  }, [deviceName]);

  return (
    <>
      <Helmet>
        <title>Pour | {capitalCase(name)}</title>
      </Helmet>
      
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography variant="overline">Start a Pour</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                <Typography variant="h2"> {capitalCase(name)}</Typography>
                <Label
                  variant="soft"
                  color={
                    online ? "success" : "error"
                  }
                sx={{ ml: 2 }}
                >
                  {online ? "Online" : "Offline"}
                </Label>
            </Box>
            <Typography variant="body1" sx={{my:3}}>
              Simply tap pour then follow the insturctions on your phone. We handle the rest.
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">
            <Container maxWidth="sm">
              <Button
                variant="contained"
                color="primary"
                size='large'
                fullWidth
              >
                Pour</Button>
            </Container>
          </Grid>

          <Grid item xs={12} align="center">
            <Typography variant="h6"> {onTap} </Typography>
            <Typography variant="caption"> ${ cost } / drink</Typography>
          </Grid>

        </Grid>
      </Container>
    </>
  );
}