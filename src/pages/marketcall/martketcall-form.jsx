import { Helmet } from 'react-helmet-async';

import { MarketCallForm } from 'src/sections/marketcall/form';

// ----------------------------------------------------------------------

export default function MarketCallFormPage() {
  return (
    <>
      <Helmet>
        <title> Market Call | Form </title>
      </Helmet>

      <MarketCallForm />
    </>
  );
}
