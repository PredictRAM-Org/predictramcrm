import { useState } from 'react';
import toast from 'react-hot-toast';
import { endOfDay } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';

import { DatePicker } from '@mui/x-date-pickers';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Card,
  Grid,
  Divider,
  Container,
  TextField,
  Typography,
  Alert,
  Stack,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import cleanObject from 'src/utils/cleanObject';

import { ROLES } from 'src/enums';
import TaskService from 'src/services/Task.service';

import PageHeader from 'src/components/pageHeader';
import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
import PredictRamService from 'src/services/PredictRam.service';
import RiskView from 'src/components/RiskView';

export default function TaskForm() {
  const { register, handleSubmit } = useForm();
  const [client, setClient] = useState('');
  const [analyst, setAnalyst] = useState('');
  const [expieryDate, setExpieryDate] = useState(endOfDay(new Date()));

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      TaskService.post(
        cleanObject({ ...data, expieryDate: endOfDay(expieryDate), client, analyst })
      ),
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/task');
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['risk-score', client],
    queryFn: () => PredictRamService.getRiskScore(client),
    select: (res) => res?.data?.riskScores,
    enabled: !!client,
  });

  const renderForm = (
    <form onSubmit={handleSubmit(mutate)}>
      <Box sx={{ flexGrow: 1, px: 3, pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={12}>
            <TextField
              name="title"
              label="Title"
              {...register('title')}
              sx={{ width: 1 }}
              required
              inputProps={{ minLength: 3, maxLength: 50 }}
            />
          </Grid>
          <Grid item xs={12} lg={12}>
            <TextField
              name="description"
              label="Description"
              {...register('description')}
              sx={{ width: 1 }}
              required
              multiline
              minRows={5}
              inputProps={{ minLength: 3 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <DatePicker
              name="expieryDate"
              label="Expiery Date"
              value={expieryDate}
              onChange={(v) => setExpieryDate(v)}
              sx={{ width: 1 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <UserAutocomplete
              name="analyst"
              placeholder="Choose a Analyst"
              value={analyst}
              filter={{ role: ROLES.ANALYST }}
              onChange={(_, v) => setAnalyst(v)}
              noLabel
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <UserAutocomplete
              name="client"
              placeholder="Choose a Client"
              value={client}
              filter={{ role: ROLES.CLIENT }}
              onChange={(_, v) => setClient(v)}
              noLabel
            />
          </Grid>

          <Grid item xs={6} lg={12}>
            {client && !data && !isLoading && (
              <Alert severity="warning">Sorry No Risk Profile Found For This Client</Alert>
            )}
            <Stack direction="row" gap={3}>
              {data?.riskProfile && (
                <RiskView riskScore={data?.riskScore} headerText="Risk Profile is" />
              )}
              {data?.riskTolerance && (
                <RiskView riskScore={data?.riskTolerance} headerText="Risk Tolerance is" />
              )}
              {data?.riskCapacity && (
                <RiskView riskScore={data?.riskCapacity} headerText="Risk Capacity is" />
              )}
            </Stack>
          </Grid>
        </Grid>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          loading={isPending}
          variant="contained"
          color="inherit"
          sx={{ my: 3 }}
        >
          Create
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Task Form" />
      <Card>
        <Typography sx={{ fontWeight: 'bold', p: 3 }}>Task Form</Typography>
        <Divider />
        {renderForm}
      </Card>
    </Container>
  );
}
