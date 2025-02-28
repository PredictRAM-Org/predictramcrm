import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import {
  Box,
  Card,
  Grid,
  Stack,
  Avatar,
  Divider,
  Collapse,
  Container,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { prependCountryCode } from 'src/utils/format-number';

import { ROLES } from 'src/enums';
import AuthService from 'src/services/Auth.service';

import Iconify from 'src/components/iconify';
import PageHeader from 'src/components/pageHeader';
import BaseTable from 'src/components/table/BaseTable';
import FileFormat from 'src/components/FileFormat/file-format';
import FileUploader from 'src/components/FileUploader/file-uploader';
import RoleAutocomplete from 'src/components/AutoComplete/RoleAutocomplete';

// import { CsvUpload } from '../../../components/form/csv-upload';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { register, handleSubmit } = useForm();
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      if (Array.isArray(data)) {
        return AuthService.register(data);
      }
      return AuthService.register([
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: prependCountryCode(data.phone),
          password: data.password,
          role,
          ...(role === ROLES.ANALYST && {
            companyDetails: {
              companyName: data.companyName,
              sebiRegistration: data.sebiRegistration,
              address: data.address,
            },
          }),
        },
      ]);
    },
    enabled: !!users,
    onError: (err) => {
      console.log(err.message);
      toast.error('Upload failed due to wrong format');
    },
    onSuccess: (data) => {
      toast.success(data.message);
      router.push('/user');
    },
  });

  const renderForm = (
    <form onSubmit={handleSubmit(mutate)}>
      <Box sx={{ flexGrow: 1, px: 3, pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <TextField
              name="firstName"
              label="First Name"
              {...register('firstName')}
              sx={{ width: 1 }}
              required
              inputProps={{ minLength: 3, maxLength: 50 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="lastName"
              label="Last Name"
              {...register('lastName')}
              sx={{ width: 1 }}
              required
              inputProps={{ minLength: 3, maxLength: 50 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="phone"
              label="Phone"
              {...register('phone')}
              sx={{ width: 1 }}
              required
              inputProps={{ minLength: 10, maxLength: 10 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="email"
              label="Email"
              {...register('email')}
              sx={{ width: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <TextField
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register('password')}
              sx={{ width: 1 }}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RoleAutocomplete
              noLabel
              placeholder="Choose Role"
              value={role}
              name="role"
              onChange={(_, v) => setRole(v)}
            />
          </Grid>
          {role === ROLES.ANALYST && (
            <>
              <Grid item xs={12} lg={6}>
                <TextField
                  name="companyName"
                  label="Company Name"
                  {...register('companyName')}
                  sx={{ width: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <TextField
                  name="sebiRegistration"
                  label="SEBI Registration"
                  {...register('sebiRegistration')}
                  sx={{ width: 1 }}
                  required
                />
              </Grid>
              <Grid item xs={12} lg={12}>
                <TextField
                  multiline
                  rows={3}
                  name="address"
                  label="Company Full Address"
                  {...register('address')}
                  sx={{ width: 1 }}
                  required
                />
              </Grid>
            </>
          )}
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
          Register
        </LoadingButton>
      </Box>
    </form>
  );
  const tableFormat = [
    {
      label: 'First Name',
      accessor: ({ firstName, avatarUrl }) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={firstName} src={avatarUrl} />
          <Typography variant="subtitle2" noWrap>
            {firstName}
          </Typography>
        </Stack>
      ),
    },
    {
      label: 'Last Name',
      accessor: ({ lastName }) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="subtitle2" noWrap>
            {lastName}
          </Typography>
        </Stack>
      ),
    },
    { label: 'Phone', accessor: 'phone' },
    { label: 'Email', accessor: 'email' },
    { label: 'Client Type', accessor: 'client_type' },
    { label: 'role', accessor: 'role' },
    { label: 'Password', accessor: 'password' },
  ];

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Users" />
      <Card>
        <Collapse in={!users.length}>
          <Typography sx={{ fontWeight: 'bold', p: 3 }}>Add User Form</Typography>
          <Divider />
          {renderForm}

          <Divider>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider>
        </Collapse>

        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography fontWeight="bold">Bulk User Register</Typography>

          <FileUploader
            setData={setUsers}
            requiredFields={['firstName', 'lastName', 'role', 'phone', 'email', 'password']}
          />

          {!users.length && <FileFormat gid={0} showCSV={false} />}

          {users.length > 0 && (
            <Box>
              <BaseTable tableData={users} tableDataFormat={tableFormat} />
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                onClick={() => mutate(users)}
                loading={isPending}
                variant="contained"
                color="inherit"
              >
                Register
              </LoadingButton>
            </Box>
          )}
        </Box>
      </Card>
    </Container>
  );
}
