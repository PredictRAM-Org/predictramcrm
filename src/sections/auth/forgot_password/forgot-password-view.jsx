import { useState } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Button, Collapse } from '@mui/material';
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

export default function ForgotPasswordView() {
  const theme = useTheme();
  const router = useRouter();
  const { register, handleSubmit } = useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(10);
  const [resend, setResend] = useState(false);
  const [email, setEmail] = useState('');
  const [otpToken, setOPTToken] = useState('');

  const Timer = () => {
    setTimer(10);
    setResend(false);
    let interval = null;
    interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setResend(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const { mutate: otpSend, isPending: otpLoading } = useMutation({
    mutationFn: (data) => {
      setEmail(data?.email);
      return AuthService.sendOTP(data);
    },
    onSuccess: (res) => {
      toast.success(res.message);
      setOtpSent(true);
      setOPTToken(res?.data?.otpToken);
      Timer();
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: resetPassword, isPending: passwordReseting } = useMutation({
    mutationFn: (data) => AuthService.resetPassword(data),
    onSuccess: (res) => {
      toast.success(res.message);
      router.push('/login');
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (data) => {
    if (!otpSent) {
      otpSend(data);
    } else {
      if (data?.newPassword !== data?.confirmPassword) {
        toast.error('password does not match with confirm password');
        return;
      }
      resetPassword({ ...data, otpToken });
    }
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
            Forgot Password
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <TextField
                sx={{ width: 1 }}
                disabled={otpSent}
                fullWidth
                name="email"
                label="Email"
                type="email"
                required
                {...register('email')}
              />
              <Collapse in={otpSent}>
                <Stack gap={1} position="relative">
                  <TextField
                    name="otp"
                    label="OTP"
                    fullWidth
                    required={otpSent}
                    {...register('otp')}
                  />
                  <Button
                    disabled={!resend}
                    onClick={() => otpSend({ email })}
                    sx={{ marginLeft: 'auto', marginY: 0 }}
                  >
                    {resend ? 'Resend OTP' : `Resend OTP in ${timer} second`}
                  </Button>
                  <TextField
                    name="newPassword"
                    label="New Password"
                    fullWidth
                    type={showNewPassword ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            <Iconify icon={showNewPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register('newPassword')}
                    required={otpSent}
                  />
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            <Iconify
                              icon={showConfirmPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    {...register('confirmPassword')}
                    required={otpSent}
                  />
                </Stack>
              </Collapse>
            </Stack>

            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="inherit"
              loading={otpLoading || passwordReseting}
              sx={{ padding: '10px', marginTop: '20px' }}
            >
              {otpSent ? 'Submit' : 'Send OTP'}
            </LoadingButton>
          </form>
        </Card>
      </Stack>
    </Box>
  );
}
