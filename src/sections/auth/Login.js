// @mui
import { Stack, Typography, Link } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthWithSocial from './AuthWithSocial';

// ----------------------------------------------------------------------

export default function Login() {
  return (
    <LoginLayout title='Welcome to OneTap' subtitle='Effortlessly pour your own drinks'>
      <Stack spacing={2} sx={{ mb: 1, position: 'relative' }}>
        <Typography variant="h4">Sign in to OneTap</Typography>

        <AuthWithSocial />
      </Stack>

      <AuthLoginForm />
      <Stack direction="row" spacing={ 0.5} alignItems="center" sx={{ my: 2 }}>
        <Typography variant="body2">New user?</Typography>
        <Link variant="subtitle2">Create an account</Link>
      </Stack>
    </LoginLayout>
  );
}
