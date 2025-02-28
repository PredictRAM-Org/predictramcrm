import { Helmet } from 'react-helmet-async';
import { ProfileMarketCallDetails } from 'src/sections/profile/details';


// ----------------------------------------------------------------------

export default function ProfileMarketCallDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Profile Market Call | Details </title>
      </Helmet>

      <ProfileMarketCallDetails />
    </>
  );
}
