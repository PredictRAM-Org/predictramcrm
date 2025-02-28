import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';
import { Stack, Divider, Collapse } from '@mui/material';

import { ROLES } from 'src/enums/index';
import UserService from 'src/services/User.service';

import FileOrSelect from 'src/components/FileOrSelect/file-or-select';

import UserAutocomplete from '../../AutoComplete/UserAutoComplete';

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

const DeAllocateComponent = ({ open, handleClose }) => {
  const [employee, setEmployee] = useState('');
  const [clients, setClients] = useState([]);

  const resetData = () => {
    setEmployee('');
    setClients([]);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => UserService.unlinkEmployee(data),
    onError: (err) => toast.error(err?.message),
    onSuccess: (data) => {
      toast.success(data?.message);
      handleClose();
      resetData();
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
            Unassign Client from Employee
          </Typography>
          <Divider />
          <Typography fontWeight="bold">Choose Employee</Typography>
          <UserAutocomplete
            size="medium"
            placeholder="Select Employee.."
            noLabel
            name="createdBy"
            labelKey="email"
            value={employee}
            filter={{
              role: ROLES.EMPLOYEE,
            }}
            onChange={(_, v) => {
              setEmployee(v);
            }}
          />
          <Collapse in={!!employee}>
            <FileOrSelect
              name="client email"
              api={UserService}
              filter={{ role: ROLES.CLIENT, managedBy: employee }}
              csvKey="Client Email"
              csvName="Available_Clients"
              dataSelectKey="user"
              label="Select Client"
              labelKey="email"
              pickKey="id"
              onChange={setClients}
              value={clients}
              showSample
              placeholder="Select client emails"
              reactQuerykey="allocate-clients"
              gid={1147707791}
              apiEnable={!!employee}
            />
          </Collapse>

          <LoadingButton
            type="submit"
            loading={isPending}
            variant="contained"
            color="inherit"
            onClick={() => mutate({ clients })}
          >
            De-Allocate
          </LoadingButton>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DeAllocateComponent;
