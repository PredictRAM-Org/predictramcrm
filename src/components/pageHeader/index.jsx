import { Stack, Typography } from '@mui/material';

export default function PageHeader({ title, children }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
      <Typography variant="h4">{title}</Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2}>
        {children}
      </Stack>
    </Stack>
  );
}
