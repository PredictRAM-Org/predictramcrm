import { Box, Container, Typography } from '@mui/material';

function NotFound({ title, subtitle, sx }) {
  return (
    <Container maxWidth="md" sx={sx}>
      <Box textAlign="center">
        <img alt="404" height={180} src="/assets/images/status/notfound.svg" />
        <Typography
          variant="h3"
          sx={{
            my: 2,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          color="text.secondary"
          fontWeight="normal"
          sx={{
            mb: 4,
          }}
        >
          {subtitle}
        </Typography>
      </Box>
    </Container>
  );
}

export default NotFound;
