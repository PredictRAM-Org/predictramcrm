import { useForm } from 'react-hook-form';

import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export default function OrganizationFilter({ setFilterQuery }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    setFilterQuery(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack sx={{ padding: 3, gap: 2 }}>
          <Typography variant="h6" marginBottom="10px">
            Filters
          </Typography>
          <TextField label="Search phone number" name="contact" {...register('contact')} />
          <TextField label="Search email" name="email" {...register('email')} />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
            Apply
          </LoadingButton>
        </Stack>
      </Card>
    </form>
  );
}
