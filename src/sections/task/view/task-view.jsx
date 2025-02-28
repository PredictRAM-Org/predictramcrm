import { useState } from 'react';

import {
  Grid,
  Link,
  Button,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { ROLES } from 'src/enums';

import Iconify from 'src/components/iconify';
import PageHeader from 'src/components/pageHeader';
import AccessControl from 'src/components/Accesscontrol';

import { useQuery } from '@tanstack/react-query';
import cleanObject from 'src/utils/cleanObject';
import TaskService from 'src/services/Task.service';
import StatCard from 'src/components/cards/StatCard';
import { DataGrid } from '@mui/x-data-grid';
import TaskTable from './task-table';
import TaskFilter from './task-filter';

const columns = [
  {
    field: 'fullName',
    headerName: 'Full name',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
  {
    field: 'email',
    headerName: 'Email',
    sortable: false,
    width: 160,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    sortable: false,
    width: 160,
  },
  {
    field: 'sebiRegistration',
    headerName: 'SEBI Registratioin',
    filterable: true,
    sortable: false,
    width: 160,
    valueGetter: (value, row) => row?.companyDetails?.sebiRegistration || 'Not Available',
  },
  {
    field: 'TOTAL TASKS',
    headerName: 'TOTAL TASKS',
    sortable: true,
    width: 160,
  },
  {
    field: 'COMPLETE TASKS',
    headerName: 'COMPLETE TASKS',
    sortable: true,
    width: 160,
  },
  {
    field: 'PENDING TASKS',
    headerName: 'PENDING TASKS',
    sortable: true,
    width: 160,
  },
  {
    field: 'REJECTED TASKS',
    headerName: 'REJECTED TASKS',
    sortable: true,
    width: 160,
  },
  {
    field: 'EXPIRED TASKS',
    headerName: 'EXPIRED TASKS',
    sortable: true,
    width: 160,
  },
];

export default function TaskPage() {
  const [filterQuery, setFilterQuery] = useState({ page: 0, limit: 5 });

  const { data: taskCount = {}, isLoading: taskCountLoading } = useQuery({
    queryKey: ['task-count', filterQuery],
    queryFn: () => TaskService.getTaskCount(cleanObject({ ...filterQuery })),
    select: (res) => res?.data || {},
  });

  const { data: allAnalaystTasks = {} } = useQuery({
    queryKey: ['all-analyst-task-count', filterQuery?.organization],
    queryFn: () =>
      TaskService.getAllAnalystTaskCount(
        cleanObject({
          organization: filterQuery?.organization,
          page: 0,
          limit: 0,
        })
      ),
    select: (res) => res?.data || {},
  });

  console.log(allAnalaystTasks);
  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Tasks">
        <AccessControl accepted_roles={ROLES.EMPLOYEE}>
          <Link component={RouterLink} href="/task/add">
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Iconify icon="eva:plus-fill" />}
            >
              Create New Task
            </Button>
          </Link>
        </AccessControl>
      </PageHeader>
      <Grid container mb={1}>
        {Object?.keys(taskCount)?.map((key) => (
          <StatCard
            isLoading={taskCountLoading}
            heading={key.replace(/_/, ' ')}
            statNum={taskCount[key] ?? 0}
            md={12 / 5}
            lg={12 / 5}
            // icon={SIM_STATUS_ICONS[item]}
          />
        ))}
      </Grid>
      <Accordion sx={{ my: 3 }}>
        <AccordionSummary
          expandIcon={<Iconify icon="ic:baseline-expand-more" />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          🔍📊 View Analyst Performance & Occupancy 📈📉{' '}
        </AccordionSummary>
        <AccordionDetails>
          <DataGrid
            rows={allAnalaystTasks?.analyst}
            columns={columns}
            getRowId={({ _id }) => _id}
            rowCount={allAnalaystTasks?.total}
            pageSizeOptions={[5, 10]}
          />
        </AccordionDetails>
      </Accordion>
      <Grid container>
        <Grid item md={3} xs={12} paddingRight={{ md: 2, xs: 0 }} paddingBottom={{ md: 0, xs: 2 }}>
          <TaskFilter filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
        </Grid>
        <Grid item md={9} xs={12}>
          <TaskTable filterQuery={filterQuery} setFilterQuery={setFilterQuery} />
        </Grid>
      </Grid>
    </Container>
  );
}
