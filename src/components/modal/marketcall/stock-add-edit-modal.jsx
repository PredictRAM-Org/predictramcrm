import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  TextField,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';
import MarketCallDurationAutoComplete from 'src/components/AutoComplete/MarketCallDurationAutoComplete';
import Iconify from 'src/components/iconify';
import ImageUploader from 'src/components/ImageUploader/image-uploader';
import FetchLoader from 'src/components/loader/fetch-loader';
import { companyNames } from 'src/enums';
import StockService from 'src/services/Stock.service';

function StockAddEditModal({ id, open, handleClose }) {
  const { id: marketCall } = useParams();
  const [stockData, setStockData] = useState({});
  const queryClient = useQueryClient();

  const { isLoading } = useQuery({
    queryKey: ['stock', id],
    queryFn: async () => {
      const { data } = await StockService.getById(id);
      setStockData(data);
      return data;
    },
    enabled: !!id,
  });

  const updateStock = (key, value) => {
    setStockData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const { mutate: handelSubmit, isPending } = useMutation({
    mutationFn: () =>
      id ? StockService.put(id, stockData) : StockService.post({ ...stockData, marketCall }),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['market-call']);
      handleClose();
    },
  });

  if (isLoading) return <FetchLoader />;

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>{id ? `Edit ${stockData?.symbol}` : 'Add Stock'}</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handelSubmit();
          }}
        >
          <ImageUploader
            height={400}
            index={stockData?.symbol}
            setImage={(v) => {
              updateStock('image', v);
            }}
            imagePath={stockData?.image}
          />
          <Grid container spacing={2} mt={3}>
            {!id && (
              <Grid item xs={12} lg={6}>
                <EnumAutocomplete
                  ENUM={companyNames}
                  name="symbol"
                  label="Choose Stock"
                  placeholder="Choose Stock"
                  noLabel
                  value={stockData?.symbol}
                  onChange={(_, v) => {
                    updateStock('symbol', v);
                  }}
                />
              </Grid>
            )}
            <Grid item xs={12} lg={6}>
              <TextField
                placeholder="Enter Stock quantity"
                label="Stock Quantity"
                value={stockData?.quantity}
                autoFocus
                sx={{ width: 1 }}
                type="text"
                required
                onChange={(e) => {
                  updateStock('quantity', e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <EnumAutocomplete
                ENUM={['SELL', 'BUY']}
                name="type"
                label="Choose Call Type"
                placeholder="Choose Call Type"
                value={stockData?.type}
                noLabel
                onChange={(_, v) => updateStock('type', v)}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <MarketCallDurationAutoComplete
                name="durationType"
                placeholder="Choose Market Call Type"
                value={stockData?.durationType}
                noLabel
                onChange={(_, v) => updateStock('durationType', v)}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                placeholder="Enter Stop Loss Price"
                label="Stop Loss Price"
                value={stockData?.stopLossPrice}
                sx={{ width: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="mdi:currency-inr" />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => updateStock('stopLossPrice', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextField
                placeholder="Enter Buy Price"
                label="Buy Price"
                value={stockData?.buyPrice}
                sx={{ width: 1 }}
                onChange={(e) => updateStock('buyPrice', e.target.value)}
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
            <Grid item xs={12} lg={6}>
              <TextField
                placeholder="Enter Target Price"
                label="Target Price"
                value={stockData?.targetPrice}
                sx={{ width: 1 }}
                onChange={(e) => updateStock('targetPrice', e.target.value)}
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
          <Stack>
            <LoadingButton
              color="inherit"
              variant="contained"
              sx={{ mt: 2 }}
              type="Submit"
              loading={isPending}
            >
              Submit
            </LoadingButton>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default StockAddEditModal;
