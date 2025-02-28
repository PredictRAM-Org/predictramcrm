import { useState } from 'react';
import { useParams } from 'react-router-dom';

import { Container } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import Tabs from 'src/components/Tabs';
import PageHeader from 'src/components/pageHeader';

import MarketCallDetails from 'src/sections/marketcall/details/market-call-details';

import MarketCallResponse from './market-call-response';

export default function MarketCallDetailsViewPage() {
  const { id, response } = useParams();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(response || '');
  const tabConfig = [
    { index: '', label: 'Details' },
    { index: 'response', label: 'Response' },
  ];

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Market Call Details" />
      {/* <AccessControl accepted_roles={[ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.SUPER_ADMIN]}> */}
      <Tabs
        sx={{ mb: 1 }}
        currentTab={currentTab}
        setCurrentTab={(d) => {
          router.push(`/market-call/details/${id}/${d}`);
          setCurrentTab(d);
        }}
        tabConfig={tabConfig}
      />
      {/* </AccessControl> */}

      {currentTab === '' && <MarketCallDetails />}
      {currentTab === 'response' && <MarketCallResponse />}
    </Container>
  );
}
