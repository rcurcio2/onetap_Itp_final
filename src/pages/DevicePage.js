import { Grid, Typography, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { doc, onSnapshot, getDoc, updateDoc} from '@firebase/firestore';
import { Container, Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { capitalCase } from 'change-case';
import { useSnackbar } from '../components/snackbar';

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
  const { enqueueSnackbar } = useSnackbar();

  async function getUserLock(uid) {
    const userRef = doc(DB, 'users', uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().displayName;
    }
    return null;
  }

  function handlePourClick() {
    // Temporary until I finish the hardware of the device which will handle the pours
    const deviceRef = doc(DB, 'machines', deviceName);
    updateDoc(deviceRef, {
      userLock: user.uid,
    });

    setTimeout(() => {
      updateDoc(deviceRef, {
        pouring: true,
      }).then(() => {
        enqueueSnackbar('Start pouring!');
      });
    }
      , 2000);
    
    setTimeout(() => {
      updateDoc(deviceRef, {
        pouring: false,
        userLock: 'open'
      });
    }
      , 10000);
    
  }

  useEffect(() => {
    const deviceRef = doc(DB, "machines", deviceName);
    const unsub = onSnapshot(deviceRef, (doc) => {
      getUserLock(doc.data().userLock).then((displayName) => {
        setUserLock(displayName);
      });    
      setOnline(doc.data().kegOnline);
      setUserLock();
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
      
      <Container maxWidth="sm">
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography variant="overline">Start a Pour</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                <Typography variant="h2"> {capitalCase(name)}</Typography>
            </Box>
            <Typography variant="body1" sx={{my:3}}>
              To pour your drink, simply tap the 'Pour' button and follow the instructions on your phone. We'll handle the rest, so you can sit back, relax, and enjoy your drink.
            </Typography>
          </Grid>

          <Grid item xs={12} align="center">

            {
              userLock === user.displayName && pouring ?
                <Alert
                  severity="success"
                  sx={{ my: 3, display: pouring ? 'flex' : 'none' }}
                >
                  <Typography >Success! Start pouring now.</Typography>
                </Alert>
                : 
                <Alert
                  severity="info"
                  sx={{ my: 3, display: pouring ? 'flex' : 'none' }}
                  
                >
                  <Typography >{userLock} is currently pouring. Please wait.</Typography>
                </Alert>
            }
           
            <Container maxWidth="sm">
              <LoadingButton
                variant="contained"
                color="primary"
                size='large'
                fullWidth
                disabled={!online || pouring || !!userLock}
                loading={ userLock === user.displayName && !pouring }
                onClick={() => {
                  handlePourClick();
                }}
              >
                { !online ? 'Device Offline' : 'Pour'}
              </LoadingButton>
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