import { LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'src/routes/hooks';
import ProfileService from 'src/services/Profile.service';

function ProfileEditModal({ profile = {}, open, handleClose }) {
  const [profileDetails, setProfileDetails] = useState(profile);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    setProfileDetails(profile);
  }, [profile]);

  const { mutate: handelSubmit, isPending } = useMutation({
    mutationFn: () => ProfileService.put(profile?.id, profileDetails),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile']);
      router.push(`/profile/${profileDetails?.username}`);
      handleClose();
    },
  });

  const handelCallDetails = (e) => {
    setProfileDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit Profile</DialogTitle>
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
                placeholder="Enter Username"
                label="Edit Username"
                name="username"
                value={profileDetails?.username}
                sx={{ width: 1 }}
                type="text"
                onChange={handelCallDetails}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                placeholder="Enter Description"
                rows={3}
                multiline
                label="Profile Description"
                name="description"
                value={profileDetails?.description}
                sx={{ width: 1 }}
                type="text"
                onChange={handelCallDetails}
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

export default ProfileEditModal;
