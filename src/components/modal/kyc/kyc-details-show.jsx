import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { Stack, Divider, Grid } from '@mui/material';

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

const KYCDetailsShowModel = ({ open, handleClose, kycDetails }) => (
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={style}>
      <Stack spacing={2}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          KYC Details
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Full Name:</strong> {kycDetails?.user_full_name}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Aadhaar Number:</strong> {kycDetails?.user_aadhaar_number}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Date of Birth:</strong> {kycDetails?.user_dob}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Gender:</strong> {kycDetails?.user_gender}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Address:</strong>{' '}
              {`${kycDetails?.user_address?.house || ''} ${
                kycDetails?.user_address?.street || ''
              } ${kycDetails?.user_address?.landmark || ''} ${
                kycDetails?.user_address?.loc || ''
              } ${kycDetails?.user_address?.po}, ${kycDetails?.user_address?.dist}, ${
                kycDetails?.user_address?.subdist
              }, ${kycDetails?.user_address?.vtc}, ${kycDetails?.user_address?.state}, ${
                kycDetails?.user_address?.country
              }`}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>ZIP Code:</strong> {kycDetails?.address_zip}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  </Modal>
);

export default KYCDetailsShowModel;
