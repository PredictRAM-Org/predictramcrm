import { Helmet } from 'react-helmet-async';

import { MarketCallDetails } from 'src/sections/marketcall/details';

// ----------------------------------------------------------------------

export default function MarketCallDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Market Call | Details </title>
      </Helmet>

      <MarketCallDetails />
    </>
  );
}
