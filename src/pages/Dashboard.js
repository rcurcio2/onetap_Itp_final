import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { collection, getDocs, doc, updateDoc, setDoc, arrayUnion } from 'firebase/firestore';

import { Helmet } from 'react-helmet-async';

import { Container, Grid, Button } from '@mui/material';
// auth
import { useAuthContext } from '../auth/useAuthContext';
import { DB } from '../auth/FirebaseContext';


// sections
import { AppWelcome, AppWidgetSummary, AppDeviceStatus } from '../sections/@dashboard/general/app';



// ----------------------------------------------------------------------

// FireBase Functions

async function getAllDevices(groups, uid) {
  const devicesRef = collection(DB, 'machines');
  const querySnapshot = await getDocs(devicesRef);
  const devices = [];
  querySnapshot.forEach((doc) => {
    devices.push({
      id: doc.id,
      user: uid,
      name: doc.data().deviceName,
      status: doc.data().kegOnline ? 'online' : 'offline',
      approved: groups.includes(doc.id),
      pending: doc.data().userRequests.includes(uid),
    });
  }
  );

  // sort devices by each rows approved status
  devices.sort((a, b) => {
    if (a.approved && !b.approved) {
      return -1;
    }
    if (!a.approved && b.approved) {
      return 1;
    }
    return 0;
  });

  return devices;
}

async function updateDeviceRequest(device, uid, displayName) {
  // update the device's users collection and add a document for the user with the uid and pending set to true
  const collectionRef = collection(DB, 'machines', device, 'users');
  const docRef = doc(collectionRef, uid);

  // add user to device's userRequests array
  const deviceRef = doc(DB, 'machines', device);
  await updateDoc(deviceRef, {
    userRequests: arrayUnion(uid),
  });
  
  // add user to device's users collection
  await setDoc(docRef, {
    pending: true,
    name: displayName,
  });
}

export default function GeneralAppPage() {
  const { user } = useAuthContext();
  const [totalPoured, setTotalPoured] = useState(0.00);
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  const onDeviceClick = (device, approved) => {
    if (!approved) {
      updateDeviceRequest(device, user.uid, user.displayName)
      .then(() => {
        const newDevices = devices.map((d) => {
          if (d.id === device) {
            return {
              ...d,
              pending: true,
            };
          }
          return d;
        });
        setDevices(newDevices);
      });
    } else {
      navigate(`/dashboard/dash/${device}/pour`);
    }
  }
  

  useEffect(() => {
    // Need snapshot on devices here
    getAllDevices(user.groups, user.uid).then((devices) => {
      // sort devices by approved
      setDevices(devices);
    });

    setTotalPoured(user?.totalPoured || 0.00);
  }, [user]);

  return (
    <>
      <Helmet>
        <title> Dashbaord | OneTap </title>
      </Helmet>

      <Container maxWidth={'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AppWelcome
              title={`Welcome back, ${user?.displayName}`}
              description="Choose a device from the available ones below to start a pour."
              action={<Button variant="contained">Go Now</Button>}
              sx={ { p: 3 } }
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
                title="Total Poured"
                label="oz"
                total={parseFloat(totalPoured)}
                chart={{
                  colors: ["#F44336"],
                  series: [1, 3, 2, 1.3, 0.6, 1.6, 2, 1.1, 1.3, 0.5],
                }}
                sx={{ height: 1 }}
              />
          </Grid>

          <Grid item xs={12} lg={12}>
            <AppDeviceStatus
              title="All Devices"
              subheader={"Request to join any group or take action on available devices"}
              tableData={devices}
              tableLabels={[
                { id: 'name', label: 'Device Name' },
                { id: 'online', label: 'Status' },
                { id: '' },
              ]}
              onDeviceClick={onDeviceClick}
            />
          </Grid>
          
        </Grid>
      </Container>
    </>
  );
}
