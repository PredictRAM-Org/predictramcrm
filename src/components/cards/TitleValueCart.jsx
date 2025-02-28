import { Card, Typography } from '@mui/material';

export default function TitleValueCart({ title, value }) {
  return (
    <Card sx={{ border: 1, p: 2, borderColor: 'lightblue' }}>
      <Typography fontWeight="bold" variant="h5">
        {title}
      </Typography>
      <Typography>{value}</Typography>
    </Card>
  );
}
