import { Helmet } from 'react-helmet-async';
// sections
import Login from '../sections/auth/Login';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | OneTap</title>
      </Helmet>

      <Login title="Welcome to One Tap"/>
    </>
  );
}