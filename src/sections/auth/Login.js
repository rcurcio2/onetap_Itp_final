// @mui
import { Alert, Tooltip, Stack, Typography, Link, Box } from '@mui/material';
// hooks
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuthContext();

  return (
    <LoginLayout title='Welcome to OneTap' subtitle='Your next drink is just a few clicks away.'>
      <Stack spacing={2} sx={{ mb: 1, position: 'relative' }}>
        <Typography variant="h4">Sign in to OneTap</Typography>

        <AuthWithSocial />
      </Stack>

      {/* <Alert severity="info" sx={{ mb: 3 }}>
        Use email : <strong>demo@minimals.cc</strong> / password :<strong> demo1234</strong>
      </Alert> */}

      <AuthLoginForm />
      <Stack direction="row" spacing={ 0.5} alignItems="center" sx={{ my: 2 }}>
        <Typography variant="body2">New user?</Typography>
        <Link variant="subtitle2">Create an account</Link>
      </Stack>
    </LoginLayout>
  );
}
