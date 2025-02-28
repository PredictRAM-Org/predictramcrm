import { useState } from 'react';
import toast from 'react-hot-toast';
import { NavLink, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
// import Button from '@mui/material/Button';
// import Divider from '@mui/material/Divider';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useMutation } from '@tanstack/react-query';

import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { bgGradient } from 'src/theme/css';
import AuthService from 'src/services/Auth.service';
import { login } from 'src/redux/reducer/user.reducer';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const router = useRouter();
  const location = useLocation();
  const from = location.state?.from || '/';

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => AuthService.login(data?.email, data?.password),
    onError: (err) => toast.error(err.message),
    onSuccess: (data) => {
      dispatch(login(data));
      router.push(from.pathname);
    },
  });

  const renderForm = (
    <form onSubmit={handleSubmit(mutate)}>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" {...register('email')} required />

        <TextField
          name="password"
          label="Password"
          required
          {...register('password')}
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
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 1 }}>
        <Link variant="subtitle2" underline="hover" component={NavLink} to="/register">
          Register
        </Link>
        <Link variant="subtitle2" underline="hover" component={NavLink} to="/forgot-password">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        loading={isPending}
      >
        Login
      </LoadingButton>
    </form>
  );

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
          <Typography variant="h4" marginBottom="10px">
            Sign in to AssetRAM(CRM)
          </Typography>

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
