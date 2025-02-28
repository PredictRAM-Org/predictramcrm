import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import Logo from 'src/components/logo';
import { Grid, Stack } from '@mui/material';
import KycService from 'src/services/Kyc.service';
import useScript from 'src/utils/useScript';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import UserService from 'src/services/User.service';
import { useState } from 'react';
import MainLoader from 'src/components/loader/main-loader';

// ----------------------------------------------------------------------
/* eslint-disable */
export default function KycView() {
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.user?.details);

  const ekyc = user?.kyc?.ekyc;
  const esign = user?.kyc?.esign;

  useScript('https://app.digio.in/sdk/v11/digio.js');

  const handelEsign = async () => {
    const { data } = await KycService.esign();
    var options = {
      environment: 'sandbox',
      callback: async function (response) {
        setLoading(true);
        try {
          if (response.hasOwnProperty('error_code')) {
            throw new Error(response?.message);
          }
          await UserService.put(user?.id, { esign: true, esignDocid: data?.id });
          window.location.reload();
        } catch (e) {
          toast.error('e-Sign Failed');
        } finally {
          setLoading(false);
        }
      },
      logo: 'https://www.mylogourl.com/image.jpeg',
      theme: {
        primaryColor: '#AB3498',
        secondaryColor: '#000000',
      },
    };

    const digio = new Digio(options);
    digio.init();
    digio.submit(data?.id, data?.signing_parties[0]?.identifier, data?.access_token?.id);
  };

  const handelEKYC = async () => {
    const { data } = await KycService.ekyc();
    var options = {
      environment: 'sandbox',
      callback: async function (response) {
        setLoading(true);
        try {
          if (response.hasOwnProperty('error_code')) {
            throw new Error(response?.message);
          }
          await UserService.put(user?.id, { ekyc: true, ekycDocid: data?.id });
          window.location.reload();
        } catch (e) {
          toast.error('e-KYC Failed');
        } finally {
          setLoading(false);
        }
      },
      logo: 'https://www.mylogourl.com/image.jpeg',
      theme: {
        primaryColor: '#AB3498',
        secondaryColor: '#000000',
      },
    };

    const digio = new Digio(options);
    digio.init();
    digio.submit(data?.id, data?.customer_identifier, data?.access_token?.id);
  };

  const renderHeader = (
    <Box
      component="header"
      sx={{
        top: 0,
        left: 0,
        width: 1,
        lineHeight: 0,
        position: 'fixed',
        p: (theme) => ({ xs: theme.spacing(3, 3, 0), sm: theme.spacing(5, 5, 0) }),
      }}
    >
      <Logo />
    </Box>
  );

  const kycButton = (onClick, text) => (
    <Button onClick={onClick} size="small" variant="contained">
      {text}
    </Button>
  );

  const completeButton = (text) => (
    <Button color="success" size="small" variant="contained">
      {text}
    </Button>
  );

  console.log(loading);
  if (loading) {
    return <MainLoader />;
  }
  return (
    <>
      {renderHeader}

      <Container>
        <Box
          sx={{
            py: 12,
            // maxWidth: 480,
            mx: 'auto',
            display: 'flex',
            minHeight: '100vh',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h3" sx={{ mb: 2 }}>
            Your Account is Not Activated!
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            Please Complete E-KYC and E-Sign Inorder To Activate Your account.
          </Typography>

          <Grid container direction="row" justifyContent="space-evenly" mt={10}>
            <Grid item sx={6}>
              <Stack gap={3}>
                <Box>
                  <Box
                    component="img"
                    src="/assets/images/adhar.png"
                    sx={{
                      mx: 'auto',
                      height: 100,
                      width: 150,
                    }}
                  />
                  <Typography variant="h4" color="rebeccapurple" fontWeight="bold">
                    e-Sign
                  </Typography>
                </Box>
                <Box>
                  {esign
                    ? completeButton('E-sign Done')
                    : kycButton(handelEsign, 'Complete E-Sign')}
                </Box>
              </Stack>
            </Grid>
            <Grid item sx={6}>
              <Stack gap={3}>
                <Box>
                  <Box
                    component="img"
                    src="/assets/images/adhar.png"
                    sx={{
                      mx: 'auto',
                      height: 100,
                      width: 150,
                    }}
                  />
                  <Typography variant="h4" color="rebeccapurple" fontWeight="bold">
                    e-KYC
                  </Typography>
                </Box>
                <Box>
                  {ekyc ? completeButton('E-KYC Done') : kycButton(handelEKYC, 'Complete E-KYC')}
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}
