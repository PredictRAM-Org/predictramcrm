import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Divider,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Box,
} from '@mui/material';
import PageHeader from 'src/components/pageHeader';
import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';
import { companyNames } from 'src/enums';
import { LoadingButton } from '@mui/lab';
import Iconify from 'src/components/iconify/iconify';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import cleanObject from 'src/utils/cleanObject';
import MarketCallAutoComplete from 'src/components/AutoComplete/MarketCallAutoComplete';
import MarketcallPortfolioService from 'src/services/MarketcallPortfolio.service';

const confirmObj = (title, description, confirmationText) => ({
  title: <h3 style={{ margin: 0 }}>{title}</h3>,
  description: <h4 style={{ margin: 0 }}>{description}</h4>,
  cancellationButtonProps: { variant: 'contained', color: 'error' },
  confirmationButtonProps: { variant: 'contained', color: 'success' },
  confirmationText,
});

function MarketCallConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [showMessage, setShowMessage] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [stockList, setStockList] = useState([]);
  const [marketcall, setMarketcall] = useState('');

  const updateStockList = (index, key, value) => {
    const newStockList = [...stockList];
    newStockList[index][key] = value;
    setStockList(newStockList);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      MarketcallPortfolioService.post(data);
    },
    onError: (err) => toast.error(err.message),
    // onSuccess: () => router.back(),
  });

  async function onSubmit(e) {
    e.preventDefault();

    const data = {
      // clients,
      stockList,
      marketcall,
    };

    await confirm(
      confirmObj(
        `Are you sure you want to create this market call ?`,
        `This call can not be deleted`,
        `Yes, Create`
      )
    );

    mutate(cleanObject(data));
  }

  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return {
      status: params.get('status'),
      requestToken: params.get('request_token'),
      action: params.get('action'),
      type: params.get('type'),
    };
  };

  const { status } = getQueryParams(location.search);

  useEffect(() => {
    if (status === 'cancelled') {
      setShowMessage(true);
      setCountdown(5); // Reset countdown to 5 seconds

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            navigate('/market-call');
            return 0; // Stop countdown
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(timer);
    }
    if (status === 'success') {
      setShowMessage(true);
    }

    return () => {};
  }, [status, navigate]);

  const basicDetailsForm = (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={6}>
        <MarketCallAutoComplete
          size="medium"
          label="Select marketcall"
          noLabel
          value={marketcall}
          name="marketcall"
          onChange={(_, v) => setMarketcall(v)}
        />
      </Grid>
      <Grid item xs={12} lg={6}>
        <EnumAutocomplete
          ENUM={companyNames}
          name="symbol"
          label="Choose Stock"
          placeholder="Choose Stock"
          noLabel
          multiple
          value={stockList?.map((v) => v?.symbol)}
          onChange={(_, v) => {
            setStockList(
              v?.map((d) => {
                const stock = stockList?.find((s) => s?.symbol === d);
                return stock ? { ...stock } : { symbol: d };
              })
            );
          }}
        />
      </Grid>
    </Grid>
  );

  const renderStockForm = (stock, index) => (
    <>
      <Typography fontWeight="bold">Enter Stock Details for {stock?.symbol}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <EnumAutocomplete
            ENUM={['SELL', 'BUY']}
            name="type"
            label="Choose Call Type"
            placeholder="Choose Call Type"
            value={stock?.type}
            noLabel
            onChange={(_, v) => updateStockList(index, 'type', v)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            placeholder="Enter Stock quantity"
            label="Stock Quantity"
            value={stock?.quantity}
            sx={{ width: 1 }}
            type="text"
            required
            onChange={(e) => {
              updateStockList(index, 'quantity', e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            placeholder="Enter Buy/SELL Price"
            label="Price"
            value={stock?.buyPrice}
            sx={{ width: 1 }}
            onChange={(e) => updateStockList(index, 'price', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:currency-inr" />
                </InputAdornment>
              ),
            }}
            required
          />
        </Grid>
      </Grid>
    </>
  );

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Market Call" />
      <Card>
        {showMessage && (
          <>
            {status === 'success' ? (
              <>
                <Typography sx={{ fontWeight: 'bold', p: 3 }}>
                  The order has been successfully placed.
                </Typography>
                <form onSubmit={onSubmit}>
                  <Box
                    sx={{
                      flexGrow: 1,
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {basicDetailsForm}
                    {stockList?.map((stock, index) => renderStockForm(stock, index))}
                    <LoadingButton
                      fullWidth
                      loading={isPending}
                      size="large"
                      type="submit"
                      variant="contained"
                      color="inherit"
                      sx={{ my: 3 }}
                    >
                      Submit
                    </LoadingButton>
                  </Box>
                </form>
              </>
            ) : (
              <>
                <Typography sx={{ fontWeight: 'bold', p: 3 }}>
                  The order has been cancelled.
                </Typography>
                <Typography sx={{ p: 3 }}>
                  You will be redirected in {countdown} seconds. Redirect to
                  <a href="/market-call" style={{ marginLeft: '4px' }}>
                    Market Call Now
                  </a>
                  .
                </Typography>
              </>
            )}
            <Divider />
          </>
        )}
      </Card>
    </Container>
  );
}

export default MarketCallConfirmation;
