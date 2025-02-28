import { Helmet } from 'react-helmet-async';

import { MarketCallView } from 'src/sections/marketcall/view';

// ----------------------------------------------------------------------

export default function MarketCallPage() {
  return (
    <>
      <Helmet>
        <title> Market Call </title>
      </Helmet>

      <MarketCallView />
    </>
  );
}
