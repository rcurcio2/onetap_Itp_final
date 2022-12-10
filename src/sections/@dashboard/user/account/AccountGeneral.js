import { useEffect, useState } from 'react';

// @mui
import { Box, Grid, Card, Stack, Typography, TextField, Switch } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

// firebase
import { DB } from "../../../../auth/FirebaseContext";
// utils
// components
import { useSnackbar } from '../../../../components/snackbar';

 


// ----------------------------------------------------------------------
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const phoneRegex = /^(?:\d{3}[-]*){2}\d{4}$/;

async function updateUserData(uid, username, email, phoneNumber, isPublic) {
  const userRef = doc(DB, 'users', uid);
  await updateDoc(userRef, {
    displayName: username,
    emailAddress: email,
    phone: phoneNumber,
    publicProfile: isPublic,
  });
}

export default function AccountGeneral(props) {

  const { enqueueSnackbar } = useSnackbar(); 

  const { id } = props;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errors, setErrors] = useState({
    username: null,
    email: null,
    phoneNumber: null,
  });

  async function getUserData(uid) {
    const userRef = doc(DB, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      setUsername(data.displayName);
      setEmail(data.emailAddress || '');
      setPhoneNumber(data.phone || '');
      setIsPublic(data.isPublic || false);
    } else {
      console.log('No such document!');
    }
  }

  useEffect(() => {
    if (id) {
      getUserData(id);
    }
  }, [id]);


  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUserData(id, username, email, phoneNumber, isPublic);
      enqueueSnackbar('Infomation successfully updated!');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 5 }}>
              General
            </Typography>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>
              <TextField label="Email" helperText={errors.email} error={!!errors.email} value={email}  onChange={(e) => {
                if (e.target.value === '') {
                  setErrors({ ...errors, email: 'Email is required' });
                } else if (emailRegex.test(e.target.value) === false) {
                  setErrors({ ...errors, email: 'Email is invalid' });
                } else {
                  setErrors({ ...errors, email: null });
                }
                setEmail(e.target.value)
              }} />
              <TextField label="Phone Number" helperText={errors.phoneNumber} error={!!errors.phoneNumber} value={phoneNumber}  onChange={(e) => {
                if (phoneRegex.test(e.target.value) === false) {
                  setErrors({ ...errors, phoneNumber: 'Ex.123-456-7890' });
                } else {
                  setErrors({ ...errors, phoneNumber: null });
                }
                setPhoneNumber(e.target.value)
              }}/>
            </Box>

            <Stack direction="row" alignItems="center" sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                Public Profile
              </Typography>
              <Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            </Stack>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting} disabled={Object.values(errors).some(error => error !== null)}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
