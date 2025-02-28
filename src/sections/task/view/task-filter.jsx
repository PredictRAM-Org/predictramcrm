import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import { ROLES, TASK_STATUS } from 'src/enums';
import { DatePicker } from '@mui/x-date-pickers';

import AccessControl from 'src/components/Accesscontrol';
import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';
import OrganizationAutocomplete from 'src/components/AutoComplete/OrganizationAutoComplete';

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
          <DatePicker
            name="fromDate"
            label="Created From"
            value={query?.fromDate}
            onChange={(v) => setQuery({ ...query, fromDate: v })}
            sx={{ width: 1 }}
          />
          <DatePicker
            name="toDate"
            label="Created To"
            value={query?.toDate}
            onChange={(v) => setQuery({ ...query, toDate: v })}
            sx={{ width: 1 }}
          />
          <AccessControl accepted_roles={[ROLES.ADMIN]}>
            <DatePicker
              name="completionFromDate"
              label="Task Completion From"
              value={query?.completionFromDate}
              onChange={(v) => setQuery({ ...query, completionFromDate: v })}
              sx={{ width: 1 }}
            />
            <DatePicker
              name="completiontoDate"
              label="Task Completion From"
              value={query?.completiontoDate}
              onChange={(v) => setQuery({ ...query, completiontoDate: v })}
              sx={{ width: 1 }}
            />
          </AccessControl>
          <EnumAutocomplete
            placeholder="Status"
            value={query?.status}
            ENUM={Object.keys(TASK_STATUS)}
            noLabel
            onChange={(_, v) => setQuery({ ...query, status: v })}
          />
          <UserAutocomplete
            placeholder="Choose Analyst"
            noLabel
            value={query?.analyst}
            filter={{ role: ROLES.ANALYST }}
            onChange={(_, v) => setQuery({ ...query, analyst: v })}
          />
          <UserAutocomplete
            placeholder="Choose Client"
            noLabel
            value={query?.client}
            filter={{ role: ROLES.CLIENT }}
            onChange={(_, v) => setQuery({ ...query, client: v })}
          />
          <AccessControl accepted_roles={[ROLES.ADMIN]}>
            <UserAutocomplete
              placeholder="Choose Employee"
              noLabel
              value={query?.createdBy}
              filter={{ role: ROLES.EMPLOYEE }}
              onChange={(_, v) => setQuery({ ...query, createdBy: v })}
            />
          </AccessControl>
          <AccessControl accepted_roles={[ROLES.SUPER_ADMIN]}>
            <OrganizationAutocomplete
              noLabel
              placeholder="Choose Organization"
              value={query?.organization}
              onChange={(_, v) => setQuery({ ...query, organization: v })}
            />
          </AccessControl>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
            Apply
          </LoadingButton>
        </Stack>
      </Card>
    </form>
  );
}
