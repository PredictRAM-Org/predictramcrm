import { useState } from 'react';
// import { isAfter } from 'date-fns';
import toast from 'react-hot-toast';
import { useConfirm } from 'material-ui-confirm';
import { useMutation } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Grid,
  Card,
  Divider,
  Container,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import cleanObject from 'src/utils/cleanObject';

import MarketcallService from 'src/services/Marketcall.service';
import { companyNames, MARKET_CALL_TYPES, /* ROLES, */ ALLOCATION_TYPE } from 'src/enums/index';

import Iconify from 'src/components/iconify';
import PageHeader from 'src/components/pageHeader';
import ImageUploader from 'src/components/ImageUploader/image-uploader';
import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';
import MarketCallDurationAutoComplete from 'src/components/AutoComplete/MarketCallDurationAutoComplete';
import FormikRichText from '../details/market-call-description';
// import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
// import { useSearchParams } from 'react-router-dom';

const confirmObj = (title, description, confirmationText) => ({
  title: <h3 style={{ margin: 0 }}>{title}</h3>,
  description: <h4 style={{ margin: 0 }}>{description}</h4>,
  cancellationButtonProps: { variant: 'contained', color: 'error' },
  confirmationButtonProps: { variant: 'contained', color: 'success' },
  confirmationText,
});

function MarketCalForm() {
  // const [searchParams] = useSearchParams();
  const confirm = useConfirm();
  const [callDetails, setCallDetails] = useState({});
  const [stockList, setStockList] = useState([]);
  const [allocation, setAllocation] = useState('');
  // const [clients, setClients] = useState([searchParams.get('client')]);

  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => MarketcallService.post(data),
    onError: (err) => toast.error(err.message),
    onSuccess: () => router.back(),
  });

  async function onSubmit(e) {
    e.preventDefault();

    const data = {
      ...callDetails,
      // clients,
      allocation,
      stockList,
    };

    if (allocation === 'PERCENTAGE') {
      const totalPercentage = stockList.reduce(
        (acc, stock) => acc + parseFloat(stock.percentage),
        0
      );

      if (totalPercentage !== 100) {
        toast.error('The total allocation percentage must equal 100%');
        return;
      }
    }

    await confirm(
      confirmObj(
        `Are you sure you want to create this market call ?`,
        `This call can not be deleted`,
        `Yes, Create`
      )
    );

    mutate(cleanObject(data));
  }

  const updateStockList = (index, key, value) => {
    const newStockList = [...stockList];
    newStockList[index][key] = value;
    setStockList(newStockList);
  };

  const handelCallDetails = (e) => {
    setCallDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderStockForm = (stock, index) => (
    <>
      <Typography fontWeight="bold">Enter Stock Details for {stock?.symbol}</Typography>
      <ImageUploader
        index={stock?.symbol}
        setImage={(v) => {
          updateStockList(index, 'image', v);
        }}
        imagePath={stock?.image}
      />
      <Grid container spacing={2}>
        {allocation === 'QUANTITY' ? (
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
        ) : (
          <Grid item xs={12} lg={6}>
            <TextField
              placeholder="Enter allocation percentage"
              label="Stock Percentage"
              value={stock?.percentage}
              sx={{ width: 1 }}
              type="text"
              required
              onChange={(e) => {
                updateStockList(index, 'percentage', e.target.value);
              }}
            />
          </Grid>
        )}
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
          <MarketCallDurationAutoComplete
            name="durationType"
            placeholder="Choose Market Call Type"
            value={stock?.durationType}
            noLabel
            onChange={(_, v) => updateStockList(index, 'durationType', v)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            placeholder="Enter Stop Loss Price"
            label="Stop Loss Price"
            value={stock?.stopLossPrice}
            required={stock?.durationType === MARKET_CALL_TYPES.INTRADAY && allocation === 'QUANTITY'}
            sx={{ width: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:currency-inr" />
                </InputAdornment>
              ),
            }}
            onChange={(e) => updateStockList(index, 'stopLossPrice', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            placeholder="Enter Buy Price"
            label="Buy Price"
            value={stock?.buyPrice}
            sx={{ width: 1 }}
            onChange={(e) => updateStockList(index, 'buyPrice', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:currency-inr" />
                </InputAdornment>
              ),
            }}
            required={allocation === 'QUANTITY'}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            placeholder="Enter Target Price"
            label="Target Price"
            value={stock?.targetPrice}
            sx={{ width: 1 }}
            onChange={(e) => updateStockList(index, 'targetPrice', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="mdi:currency-inr" />
                </InputAdornment>
              ),
            }}
            required={allocation === 'QUANTITY'}
          />
        </Grid>
      </Grid>
    </>
  );

  const basicDetailsForm = (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          placeholder="Enter Title"
          label="Title"
          name="title"
          value={callDetails?.title}
          sx={{ width: 1 }}
          type="text"
          required
          onChange={handelCallDetails}
        />
      </Grid>
      {/* <Grid item xs={12}>
        <TextField
          placeholder="Enter Description"
          rows={3}
          multiline
          label="Description"
          name="description"
          value={callDetails?.description}
          sx={{ width: 1 }}
          type="text"
          required
          onChange={handelCallDetails}
        />
      </Grid> */}
      <FormikRichText
        id="description"
        name="description"
        label="Description"
        value={callDetails?.description}
        setCallDetails={setCallDetails}
      />
      <Grid item xs={12} lg={6}>
        <EnumAutocomplete
          ENUM={ALLOCATION_TYPE}
          name="allocation"
          label="Choose stock allocation type"
          placeholder="Choose stock allocation type"
          noLabel
          value={allocation}
          onChange={(_, v) => {
            setStockList([]);
            setAllocation(v);
          }}
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
      {/* <Grid item xs={12} lg={6}>
        <UserAutocomplete
          name="clients"
          placeholder="Choose Clients"
          noLabel
          multiple
          value={clients}
          filter={{ role: ROLES.CLIENT }}
          onChange={(_, v) => setClients(v)}
        />
      </Grid> */}
    </Grid>
  );

  const renderForm = (
    <form onSubmit={onSubmit}>
      <Box sx={{ flexGrow: 1, px: 3, pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {basicDetailsForm}
        {allocation && stockList?.map((stock, index) => renderStockForm(stock, index))}
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
  );

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader title="Market Call " />
      <Card>
        <Typography sx={{ fontWeight: 'bold', p: 3 }}>Add Market Call Form</Typography>
        <Divider />
        {renderForm}
      </Card>
    </Container>
  );
}

export default MarketCalForm;
