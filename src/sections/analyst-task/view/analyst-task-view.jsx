import { useState } from 'react';

import { Grid, Container } from '@mui/material';
import PageHeader from 'src/components/pageHeader';

import cleanObject from 'src/utils/cleanObject';
import TaskService from 'src/services/Task.service';
import StatCard from 'src/components/cards/StatCard';
import { useQuery } from '@tanstack/react-query';
import TaskTable from './analyst-task-table';
import TaskFilter from './analyst-task-filter';

export default function TaskPage() {
  const [filterQuery, setFilterQuery] = useState({ page: 0, limit: 5 });

  const { data: taskCount = {}, isLoading: taskCountLoading } = useQuery({
    queryKey: ['analyst-task-count'],
    queryFn: () => TaskService.getAnalystTaskCount(cleanObject({ ...filterQuery })),
    select: (res) => res?.data || {},
  });

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Tasks" />

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
