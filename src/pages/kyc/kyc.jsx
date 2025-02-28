import { Helmet } from 'react-helmet-async';

import { KycView } from 'src/sections/kyc';

// ----------------------------------------------------------------------

export default function KYCPage() {
  return (
    <>
      <Helmet>
        <title> KYC </title>
      </Helmet>

      <KycView />
    </>
  );
}
