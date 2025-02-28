import { Helmet } from 'react-helmet-async';

import { MarketCallConfirmation } from 'src/sections/marketcall/confirmation';

// ----------------------------------------------------------------------

export default function MarketCallConfirmationPage() {
  return (
    <>
      <Helmet>
        <title> Market Call | Confirmation </title>
      </Helmet>

      <MarketCallConfirmation />
    </>
  );
}
