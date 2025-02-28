import { useState } from 'react';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { useRouter } from 'src/routes/hooks';

import { ROLES } from 'src/enums';
import Tabs from 'src/components/Tabs';

import Iconify from 'src/components/iconify';
import PageHeader from 'src/components/pageHeader';
import AccessControl from 'src/components/Accesscontrol';

import { useSelector } from 'react-redux';
import MarketCallCards from './market-call-cards';
import MarketCallFilter from './market-call-filter';

// ----------------------------------------------------------------------

export default function BlogView() {
  const router = useRouter();
  const { id: userId, role } = useSelector((state) => state.user.details);
  const [currentTab, setCurrentTab] = useState('All');
  const tabConfig = [
    { index: 'All', label: 'All' },
    { index: 'Subscribed', label: 'Subscribed' },
  ];

  const [filter, setFilter] = useState({
    page: 0,
    limit: 5,
  });

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Market Call">
        <AccessControl accepted_roles={[ROLES.ANALYST]}>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => router.push('/market-call/add')}
          >
            Add New Market Call
          </Button>
        </AccessControl>
      </PageHeader>

      {role === 'CLIENT' ? (
        <>
          <Tabs
            sx={{ mb: 1 }}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabConfig={tabConfig}
          />
          <MarketCallFilter setFilter={setFilter} filter={filter} />
          {currentTab === 'All' && <MarketCallCards filter={filter} setFilter={setFilter} />}
          {currentTab === 'Subscribed' && (
            <MarketCallCards filter={{ ...filter, client: userId }} setFilter={setFilter} />
          )}
        </>
      ) : (
        <>
          <MarketCallFilter setFilter={setFilter} filter={filter} />
          <MarketCallCards filter={filter} setFilter={setFilter} />
        </>
      )}
    </Container>
  );
}
