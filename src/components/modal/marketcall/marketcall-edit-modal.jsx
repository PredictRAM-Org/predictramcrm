import { LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import FormikRichText from 'src/sections/marketcall/details/market-call-description';
import MarketcallService from 'src/services/Marketcall.service';

function MarketCallEditModal({ calldata = {}, open, handleClose }) {
  const [callDetails, setCallDetails] = useState(calldata);
  const queryClient = useQueryClient();

  const { mutate: handelSubmit, isPending } = useMutation({
    mutationFn: () => MarketcallService.put(callDetails?._id, callDetails),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['market-call']);
      handleClose();
    },
  });

  const handelCallDetails = (e) => {
    setCallDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit MarketCall</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handelSubmit();
          }}
        >
          <Grid container spacing={2} mt={1}>
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

export default MarketCallEditModal;
