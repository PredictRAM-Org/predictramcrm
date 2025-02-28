import { useState } from 'react';

import Button from '@mui/material/Button';
import { Grid, Link } from '@mui/material';
import Container from '@mui/material/Container';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import PageHeader from 'src/components/pageHeader';

import OrganizationTable from './organization-table';
import OrganizationFilter from './organization-filter';

export default function OrganizationPage() {
  const [filterQuery, setFilterQuery] = useState({});

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Organization">
        <Link component={RouterLink} href="/organization/add">
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Organization
          </Button>
        </Link>
      </PageHeader>

      <Grid container>
        <Grid item md={3} xs={12} paddingRight={{ md: 2, xs: 0 }} paddingBottom={{ md: 0, xs: 2 }}>
          <OrganizationFilter setFilterQuery={setFilterQuery} />
        </Grid>
        <Grid item md={9} xs={12}>
          <OrganizationTable filterQuery={filterQuery} />
        </Grid>
      </Grid>
    </Container>
  );
}
