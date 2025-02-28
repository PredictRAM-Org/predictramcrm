import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import { Stack, Dialog, Collapse, TextField, DialogTitle, DialogContent } from '@mui/material';

import cleanObject from 'src/utils/cleanObject';

import { RESPONSE_STATUS } from 'src/enums/index';
import ResponseService from 'src/services/Response.service';

import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';

const ResponseStatusModal = ({ open, handleClose, responseId, queryKey }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [comment, setComment] = useState('');

  console.log(responseId);

  const resetData = () => {
    setStatus('');
    setComment('');
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => ResponseService.put(responseId, data),
    onError: (err) => toast.error(err?.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(queryKey);
      handleClose();
      resetData();
    },
  });
  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Change Response Status</DialogTitle>
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutate(cleanObject({ status, comment }));
          }}
        >
          <Stack spacing={2}>
            <Typography fontWeight="bold">Choose Status</Typography>
            <EnumAutocomplete
              noLabel
              value={status}
              placeholder="Chosse status"
              ENUM={['COMPLETE', 'REJECTED']}
              onChange={(_, v) => setStatus(v)}
            />
            <Collapse in={status === RESPONSE_STATUS.REJECTED}>
              <Typography fontWeight="bold">Comment</Typography>
              <TextField
                placeholder="Write reason for Reject"
                value={comment}
                fullWidth
                required={status === RESPONSE_STATUS.REJECTED}
                onChange={(e) => setComment(e.target.value)}
              />
            </Collapse>
            <LoadingButton type="submit" loading={isPending} variant="contained" color="inherit">
              Update
            </LoadingButton>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ResponseStatusModal;
