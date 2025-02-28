import { Container } from '@mui/material';

import Logo from '../logo';

export default function MainLoader() {
  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Logo />
    </Container>
  );
}
