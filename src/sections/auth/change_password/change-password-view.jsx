import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import AuthService from 'src/services/Auth.service';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

export default function ChangePasswordView() {
  const theme = useTheme();
  const [showCurrentPassword, setShowCurrrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (value) => AuthService.changePassword(value),
    onError: (err) => toast.error(err.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      router.push('/');
    },
  });

  const onSubmit = (data) => {
    if (data?.newPassword !== data?.confirmPassword)
      toast.error('password does not match with confirm password');
    else mutate(data);
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" marginBottom={2}>
            Change Password
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                name="currentPassword"
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        <Iconify icon={showCurrentPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('currentPassword')}
                required
              />

              <TextField
                name="newPassword"
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                        <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('newPassword')}
                required
              />

              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        <Iconify icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                {...register('confirmPassword')}
                required
              />
            </Stack>

            <LoadingButton
              fullWidth
              loading={isPending}
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              sx={{ padding: '10px', marginTop: '20px' }}
            >
              Change Password
            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
