import * as React from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import {
  Grid,
  Card,
  Divider,
  Container,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { prependCountryCode } from 'src/utils/format-number';

import { ROLES } from 'src/enums';
import OrganizationService from 'src/services/Organization.service';

import Iconify from 'src/components/iconify';
import PageHeader from 'src/components/pageHeader';

const steps = ['Company details', 'Company Address', 'Primary user details'];

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      OrganizationService.post({
        organization: {
          name: data.name,
          contact: prependCountryCode(data.contact),
          email: data.orgEmail,
          address: {
            houseNumber: data.houseNumber,
            area: data.area,
            landmark: data.landmark,
            pin: data.pin,
            city: data.city,
            state: data.state,
            country: data.country,
          },
        },
        user: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: prependCountryCode(data.phone),
          password: data.password,
          role: ROLES.ADMIN,
        },
      }),
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (data) => {
      router.push('/organization');
    },
  });

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const { register, handleSubmit } = useForm();

  const profileForm = (
    <Box sx={{ flexGrow: 1, pt: 2 }}>
      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item xs={12} lg={6}>
          <TextField
            name="name"
            label="Name"
            {...register('name')}
            sx={{ width: 1 }}
            required
            inputProps={{ minLength: 3, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="contact"
            label="Contact"
            {...register('contact')}
            sx={{ width: 1 }}
            required
            // defaultValue="+91"
            inputProps={{ minLength: 10, maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="email"
            label="Email"
            {...register('orgEmail')}
            sx={{ width: 1 }}
            required
          />
        </Grid>
      </Grid>
    </Box>
  );

  const addressForm = (
    <Box sx={{ flexGrow: 1, pt: 2 }}>
      <Grid container spacing={2} sx={{ my: 3 }}>
        <Grid item xs={12} lg={6}>
          <TextField
            name="houseNumber"
            label="House number"
            {...register('houseNumber')}
            sx={{ width: 1 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="area"
            label="Area"
            {...register('area')}
            sx={{ width: 1 }}
            // inputProps={{ minLength: 10, maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="landmark"
            label="Landmark"
            {...register('landmark')}
            sx={{ width: 1 }}
            // inputProps={{ minLength: 10, maxLength: 10 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="pin"
            label="Pin code"
            {...register('pin')}
            sx={{ width: 1 }}
            required
            // inputProps={{ minLength: 3, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="city"
            label="City"
            {...register('city')}
            sx={{ width: 1 }}
            required
            // inputProps={{ minLength: 3, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="state"
            label="State"
            {...register('state')}
            sx={{ width: 1 }}
            required
            // inputProps={{ minLength: 3, maxLength: 50 }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            name="country"
            label="Country"
            {...register('country')}
            sx={{ width: 1 }}
            required
            // inputProps={{ minLength: 3, maxLength: 50 }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const userForm = (
    <Box sx={{ flexGrow: 1, pt: 2 }}>
      <Grid container spacing={2} sx={{ my: 3 }}>
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
          <TextField name="email" label="Email" {...register('email')} sx={{ width: 1 }} required />
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
      </Grid>
    </Box>
  );

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Organization" />
      <Card>
        <Typography sx={{ fontWeight: 'bold', p: 3 }}>Add Organization Form</Typography>
        <Divider />
        <Box sx={{ width: '100%', p: 3 }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Box sx={{ flex: '1 1 auto' }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </>
          ) : (
            <form onSubmit={handleSubmit(mutate)}>
              {activeStep === 0 && <div>{profileForm}</div>}
              {activeStep === 1 && <div>{addressForm}</div>}
              {activeStep === 2 && <div>{userForm}</div>}
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />

                {activeStep === steps.length - 1 ? (
                  <LoadingButton
                    type="submit"
                    loading={isPending}
                    variant="contained"
                    color="inherit"
                  >
                    Register
                  </LoadingButton>
                ) : (
                  <Button onClick={handleNext} color="inherit" variant="outlined">
                    Next
                  </Button>
                )}
              </Box>
            </form>
          )}
        </Box>
      </Card>
    </Container>
  );
}
