import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Card, Stack, Collapse } from '@mui/material';

import { ROLES } from 'src/enums';

import AccessControl from 'src/components/Accesscontrol';
import RoleAutocomplete from 'src/components/AutoComplete/RoleAutocomplete';
import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
import ClientTypeAutocomplete from 'src/components/AutoComplete/ClientTypeAutocomplete';
import OrganizationAutocomplete from 'src/components/AutoComplete/OrganizationAutoComplete';

export default function UserFilter({ setFilterQuery, filterQuery }) {
  const { register, handleSubmit } = useForm();
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [employee, setEmployee] = useState('');
  const [client_type, setClientType] = useState('');

  const onSubmit = (data) => {
    setFilterQuery({
      ...filterQuery,
      ...data,
      role,
      organization,
      managedBy: employee,
      client_type,
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
          <TextField label="Search phone number" name="phone" {...register('phone')} />
          <TextField label="Search email" name="email" {...register('email')} />
          <RoleAutocomplete
            noLabel
            value={role}
            onChange={(_, v) => setRole(v)}
            placeholder="Select Role"
          />
          <Collapse in={role === ROLES.CLIENT}>
            <ClientTypeAutocomplete
              noLabel
              value={client_type}
              onChange={(_, v) => setClientType(v)}
              placeholder="Client Type"
            />
          </Collapse>
          <AccessControl accepted_roles={[ROLES.ADMIN]}>
            <UserAutocomplete
              placeholder="Managed By"
              noLabel
              value={employee}
              filter={{ role: ROLES.EMPLOYEE }}
              onChange={(_, v) => setEmployee(v)}
              labelKey="email"
            />
          </AccessControl>
          <AccessControl accepted_roles={[ROLES.SUPER_ADMIN]}>
            <OrganizationAutocomplete
              noLabel
              value={organization}
              onChange={(_, v) => setOrganization(v)}
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

// UserTableFilter.propTypes = {
//   tableData: PropTypes.array.isRequired,
//   filterOptions: PropTypes.shape({
//     companyName: PropTypes.string.isRequired,
//     role: PropTypes.string.isRequired,
//     isVerified: PropTypes.string.isRequired,
//     status: PropTypes.string.isRequired,
//   }).isRequired,
//   onFilterChange: PropTypes.func,
// };
