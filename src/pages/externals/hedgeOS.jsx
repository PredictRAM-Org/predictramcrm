import { Helmet } from 'react-helmet-async';

import { HedgeOSView } from 'src/sections/hedgeOS/view';

// ----------------------------------------------------------------------

export default function HedgeOSPage() {
  return (
    <>
      <Helmet>
        <title> HedgeOS </title>
      </Helmet>

      <HedgeOSView />
    </>
  );
}