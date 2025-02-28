import { Helmet } from 'react-helmet-async';

import OrgRegisterView from 'src/sections/organization/form/organization-form';

// ----------------------------------------------------------------------

export default function OrgRegistrationPage() {
  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>

      <OrgRegisterView />
    </>
  );
}
