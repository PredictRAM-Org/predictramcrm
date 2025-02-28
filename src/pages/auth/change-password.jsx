import { Helmet } from 'react-helmet-async';

import { ChangePasswordView } from 'src/sections/auth/change_password';

// ----------------------------------------------------------------------

export default function ChangePasswordPage() {
  return (
    <>
      <Helmet>
        <title> Change Password </title>
      </Helmet>

      <ChangePasswordView />
    </>
  );
}
