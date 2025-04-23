import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import { Stack, Divider, TextField } from '@mui/material';

import KycService from 'src/services/Kyc.service';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

const KYCVerifyModel = ({ open, handleClose }) => {
  const [otp, setOtp] = useState('');
  const [aadhaar_number, setAadharNumber] = useState('');
  const [request_id, setRequestId] = useState('');

  const { mutate: handelKYC, isPending: kycLoading } = useMutation({
    mutationFn: (data) => KycService.ekyc(data),
    onError: (err) => toast.error(err?.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      console.log(data);
      setRequestId(data?.data?.request_id);
    },
  });

  const { mutate: handelVerify, isPending: verifyLoading } = useMutation({
    mutationFn: (data) => KycService.ekycVerify(data),
    onError: (err) => toast.error(err?.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      window.location.reload();
    },
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Stack spacing={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            E-KYC Verification
          </Typography>
          <Divider />

          {request_id ? (
            <TextField
              placeholder="Enter OTP"
              label="Enter OTP"
              name="otp"
              value={otp}
              sx={{ width: 1 }}
              type="text"
              onChange={(e) => setOtp(e.target.value)}
            />
          ) : (
            <TextField
              placeholder="Enter Aadhar Number"
              label="Enter Aadhar Number"
              name="aadhaar_number"
              value={aadhaar_number}
              sx={{ width: 1 }}
              type="text"
              onChange={(e) => setAadharNumber(e.target.value)}
            />
          )}
          {request_id ? (
            <LoadingButton
              type="submit"
              loading={verifyLoading}
              variant="contained"
              color="inherit"
              onClick={() => handelVerify({ request_id, otp })}
            >
              Verify
            </LoadingButton>
          ) : (
            <LoadingButton
              type="submit"
              loading={kycLoading}
              variant="contained"
              color="inherit"
              onClick={() => handelKYC({ aadhaar_number })}
            >
              Generate OTP
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </Modal>
  );
};

export default KYCVerifyModel;
