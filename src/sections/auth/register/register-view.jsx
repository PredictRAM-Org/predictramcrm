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
  Divider,
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
import RoleAutocomplete from 'src/components/AutoComplete/RoleAutocomplete';
import OrganizationAutocomplete from 'src/components/AutoComplete/OrganizationAutoComplete';
// import { useLocation } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { login } from 'src/redux/reducer/user.reducer';

// import { CsvUpload } from '../../../components/form/csv-upload';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { register, handleSubmit } = useForm();
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  // const dispatch = useDispatch();
  // const location = useLocation();
  // const from = location.state?.from || '/';

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
          organization,
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
    onError: (err) => {
      console.log(err.message);
      toast.error(err.message);
    },
    onSuccess: (data) => {
      // dispatch(login(data));
      toast.success(data.message);
      router.push('/login');
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
          <Grid item xs={12} lg={6}>
            <OrganizationAutocomplete
              noLabel
              size="small"
              label="Select organization"
              value={organization}
              name="organization"
              onChange={(_, v) => setOrganization(v)}
            />
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
          Register
        </LoadingButton>
      </Box>
    </form>
  );

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Register" />
      <Card>
        <Typography sx={{ fontWeight: 'bold', p: 3 }}>Registration Form</Typography>
        <Divider />
        {renderForm}
      </Card>
    </Container>
  );
}
