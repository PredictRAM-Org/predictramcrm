import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Typography,
  DialogContent,
  DialogActions,
} from '@mui/material';

import cleanObject from 'src/utils/cleanObject';

import { DatePicker } from '@mui/x-date-pickers';
import { LoadingButton } from '@mui/lab';
import { ROLES, TASK_STATUS } from 'src/enums';

import TaskService from 'src/services/Task.service';

import FetchLoader from 'src/components/loader/fetch-loader';
import UserAutocomplete from 'src/components/AutoComplete/UserAutoComplete';
import { endOfDay, isAfter } from 'date-fns';
import { fDate } from 'src/utils/format-time';

function AnalystUpdateModal({ handelClose, open, id = null }) {
  const [task, setTask] = useState({});
  const queryClient = useQueryClient();

  const { isLoading, data } = useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => TaskService.getById(id),
    select: (res) => res?.data,
    enabled: !!id,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (d) =>
      TaskService.changeAnalyst(
        id,
        cleanObject({ analyst: task?.analyst, expieryDate: endOfDay(new Date(task?.expieryDate)) })
      ),
    onError: (err) => {
      toast.error(err.message);
    },
    onSuccess: (d) => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('task-count');
      queryClient.invalidateQueries('all-analyst-task-count');
      toast.success(d.message);
      handelClose();
    },
  });

  const determineStatus = (status, expieryDate) => {
    if (status === TASK_STATUS.PENDING && isAfter(new Date(), new Date(expieryDate)))
      return TASK_STATUS.EXPIRED;
    return status;
  };

  return (
    <Dialog open={open} onClose={handelClose} fullWidth>
      <DialogContent sx={{ borderRadius: '10px', boxShadow: 'none' }}>
        {isLoading && <FetchLoader />}
        {!isLoading && (
          <Box>
            <Typography gutterBottom variant="h5" component="div">
              {data?.title}
            </Typography>
            <Typography gutterBottom variant="subtitle1">
              Expiery Date {fDate(data?.expieryDate)}
            </Typography>
            <Chip label={determineStatus(data?.status, data?.expieryDate)} />
            <Stack gap={2} alignItems="flex" mt={2}>
              <UserAutocomplete
                placeholder="Choose New Analyst"
                noLabel
                value={task?.analyst}
                filter={{ role: ROLES.ANALYST }}
                onChange={(_, v) => setTask({ ...task, analyst: v })}
              />
              <DatePicker
                name="expieryDate"
                label="Expiery Date"
                onChange={(v) => setTask({ ...task, expieryDate: v })}
                sx={{ width: 1 }}
              />
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <LoadingButton
          onClick={() => mutate()}
          size="medium"
          type="submit"
          loading={isPending}
          variant="contained"
          color="success"
          sx={{ my: 3 }}
        >
          Update
        </LoadingButton>
        <Button color="error" variant="contained" onClick={handelClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AnalystUpdateModal;
