import { Helmet } from 'react-helmet-async';

import { ResponseView } from 'src/sections/response/view';

export default function ClientResponses() {
  return (
    <>
      <Helmet>
        <title> Client Responses </title>
      </Helmet>

      <ResponseView />
    </>
  );
};
