import { Helmet } from 'react-helmet-async';

import { ForgotPasswordView } from 'src/sections/auth/forgot_password';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Forgot Password </title>
      </Helmet>

      <ForgotPasswordView />
    </>
  );
}
