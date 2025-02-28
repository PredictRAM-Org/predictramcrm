import { Container } from '@mui/material';
import Profile from 'src/layouts/dashboard/profile/profile';

export default function ProfileView() {
  return (
    <Container
      sx={{
        bgcolor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        borderRadius: '8px',
        position: 'relative',
        top: '64px',
      }}
    >
      <Profile />
    </Container>
  );
}
