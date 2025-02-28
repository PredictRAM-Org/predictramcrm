import { useState } from 'react';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Stack, Dialog, Divider, TextField, DialogContent } from '@mui/material';

import { ROLES } from 'src/enums/index';
import NoteService from 'src/services/Task.service';

import FetchLoader from 'src/components/loader/fetch-loader';

import UserAutocomplete from '../../AutoComplete/UserAutoComplete';

const NoteCreateEdit = ({ open, handleClose, id = null }) => {
  const queryClient = useQueryClient();
  const [note, setNote] = useState({});
  const [date, setDate] = useState('');
  const [clients, setClients] = useState([]);

  const resetData = () => {
    setNote({});
    setClients([]);
    setDate('');
  };

  const handelOnChange = (e) => setNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const { isLoading } = useQuery({
    queryKey: ['notes', id],
    queryFn: async () => {
      const { data } = await NoteService.getById(id);
      setNote({ ...data });
      setDate(new Date(data?.date));
      setClients(data?.assignedUsers);
      return data;
    },

    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => (id ? NoteService.put(id, data) : NoteService.post(data)),
    onError: (err) => toast.error(err?.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(['notes']);
      handleClose();
      resetData();
    },
  });
  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogContent>
        {isLoading && <FetchLoader />}
        {!isLoading && (
          <Stack spacing={2}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Note
            </Typography>
            <Divider />
            <Typography fontWeight="bold">Title</Typography>
            <TextField
              placeholder="Write a title.."
              value={note?.name}
              name="name"
              fullWidth
              required
              onChange={handelOnChange}
            />
            <Typography fontWeight="bold">Description</Typography>
            <TextField
              multiline
              minRows={3}
              maxRows={6}
              placeholder="Write a description"
              value={note?.description}
              name="description"
              fullWidth
              required
              onChange={handelOnChange}
            />
            <Typography fontWeight="bold">Date</Typography>
            <DateTimePicker
              name="date"
              sx={{ width: 1 }}
              value={date}
              minDate={new Date()}
              onChange={(v) => {
                setDate(v);
              }}
            />
            <Typography fontWeight="bold">Choose Clients</Typography>
            <UserAutocomplete
              size="medium"
              placeholder="Select Clients.."
              noLabel
              name="assignedUsers"
              labelKey="email"
              multiple
              value={clients}
              filter={{
                role: ROLES.CLIENT,
              }}
              onChange={(_, v) => {
                setClients(v);
              }}
            />

            <LoadingButton
              type="submit"
              loading={isPending}
              variant="contained"
              color="inherit"
              onClick={() => mutate({ ...note, assignedUsers: clients, date })}
            >
              {id ? 'Edit' : 'Create'}
            </LoadingButton>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NoteCreateEdit;
