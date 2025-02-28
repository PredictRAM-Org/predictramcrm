import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Card, Button } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';

import { ROLES } from 'src/enums/index';

import AccessControl from 'src/components/Accesscontrol';
import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
import OrganizationAutocomplete from 'src/components/AutoComplete/OrganizationAutoComplete';

export default function MarketCallFilter({ setFilter, filter }) {
  // const router = useRouter();
  const [organization, setOrganization] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const user = useSelector((state) => state?.user?.details);

  const onFormSubmit = (e) => {
    e.preventDefault();
    setFilter({ ...filter, organization, createdBy, page: 0 });
  };
  return (
    <Grid2 sx={{ mb: 2 }} container justifyContent="space-between" alignItems="center" gap={3}>
      {/* <Grid2 sx={{ display: 'flex' }} gap={0.5}>
        <Card sx={{ borderRadius: 1, display: 'flex', gap: '0.5rem' }}>
          <Dropdown
            onChange={(e) => {
              setFilter({ ...filter, type: e.target.value, page: 0 });
              router.push(`/market-call/${e.target.value}/${filter?.marketState}/${filter?.view}`);
            }}
            value={filter?.type}
            options={Object.keys(MARKET_CALL_TYPES).map((key) => ({
              value: key,
              label: MARKET_CALL_TYPES[key],
            }))}
            label="Choose market type"
            nolabel
          />
        </Card>

        <AccessControl accepted_roles={[ROLES.CLIENT]}>
          <Card sx={{ borderRadius: 1, display: 'flex', gap: '0.5rem' }}>
            <Dropdown
              onChange={(e) => {
                router.push(`/market-call/${filter.type}/${filter?.marketState}/${e.target.value}`);
                setFilter({ ...filter, view: e.target.value, page: 0 });
              }}
              value={filter?.view || 'Not Submitted'}
              options={['Not Submitted', 'Submitted'].map((key) => ({
                value: key,
                label: key,
              }))}
            />
          </Card>
        </AccessControl>

        <AccessControl accepted_roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.EMPLOYEE]}>
          <Card sx={{ borderRadius: 1 }}>
            <Dropdown
              onChange={(e) => {
                setFilter({ ...filter, marketState: e.target.value, page: 0 });
                router.push(`/market-call/${filter.type}/${e.target.value}/${filter?.view}`);
              }}
              value={filter?.marketState}
              options={[
                { value: 'live', label: 'Live' },
                { value: 'ended', label: 'Ended' },
              ]}
              label="Choose market state"
              nolabel
            />
          </Card>
        </AccessControl>
      </Grid2> */}

      <Grid2
        md={6}
        xs={12}
        container
        gap={0.5}
        alignItems="center"
        component="form"
        onSubmit={onFormSubmit}
      >
        <AccessControl accepted_roles={[ROLES.SUPER_ADMIN]}>
          <Grid2 md={5} xs={12}>
            <Card sx={{ borderRadius: 1 }}>
              <OrganizationAutocomplete
                size="small"
                label="Select organization"
                noLabel
                value={organization}
                name="organization"
                onChange={(_, v) => setOrganization(v)}
              />
            </Card>
          </Grid2>
        </AccessControl>
        <AccessControl accepted_roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
          <Grid2 md={5} xs={12}>
            <Card sx={{ borderRadius: 1 }}>
              <UserAutocomplete
                size="small"
                placeholder="Select Analyst.."
                noLabel
                name="createdBy"
                labelKey="email"
                value={createdBy}
                filter={{
                  role: ROLES.ANALYST,
                  organization: user?.organization || organization,
                }}
                enabled={!!user?.organization || !!organization}
                onChange={(_, v) => setCreatedBy(v)}
              />
            </Card>
          </Grid2>
        </AccessControl>
        <AccessControl accepted_roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
          <Grid2 md={1} xs={12}>
            <Button variant="contained" color="inherit" type="submit">
              Search
            </Button>
          </Grid2>
        </AccessControl>
      </Grid2>
    </Grid2>
  );
}
