import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ROLES, TASK_STATUS } from 'src/enums';

import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';

export default function TaskFilter({ setFilterQuery, filterQuery }) {
  const { handleSubmit } = useForm();

  const [query, setQuery] = useState({});

  const onSubmit = (data) => {
    setFilterQuery({
      ...filterQuery,
      ...data,
      ...query,
      page: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack sx={{ padding: 3, gap: 2 }}>
          <Typography variant="h6" marginBottom="10px">
            Filters
          </Typography>
          <EnumAutocomplete
            placeholder="Status"
            value={query?.status}
            ENUM={Object.keys(TASK_STATUS)}
            noLabel
            onChange={(_, v) => setQuery({ ...query, status: v })}
          />

          <UserAutocomplete
            placeholder="Choose Client"
            noLabel
            value={query?.client}
            filter={{ role: ROLES.CLIENT }}
            onChange={(_, v) => setQuery({ ...query, client: v })}
          />

          <UserAutocomplete
            placeholder="Choose Employee"
            noLabel
            value={query?.createdBy}
            filter={{ role: ROLES.EMPLOYEE }}
            onChange={(_, v) => setQuery({ ...query, createdBy: v })}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
            Apply
          </LoadingButton>
        </Stack>
      </Card>
    </form>
  );
}
