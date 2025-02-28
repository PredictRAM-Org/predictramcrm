import { Button, Container, Typography } from '@mui/material';

import PageHeader from 'src/components/pageHeader';

export default function CGPUPage() {
  return (
    <Container
      sx={{
        mt: 3,
        bgcolor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        borderRadius: '8px',
        position: 'relative',
        top: '64px',
      }}
    >
      <PageHeader title="CGPU" />

      <Typography variant="h5" gutterBottom>
        Unleashing Financial Insights with AI Precision!
      </Typography>

      <Typography variant="body1" component="ul" gutterBottom>
        <Typography component="li">
          <b>Comprehensive Understanding:</b> PredictGpt provides in-depth explanations of financial
          terms, ensuring users gain a comprehensive understanding of the terminology.
        </Typography>
        <Typography component="li">
          <b>Dynamic AI Analysis:</b> Leverage the power of dynamic AI analysis to receive real-time
          insights and stay updated on the latest financial trends and terms.
        </Typography>
        <Typography component="li">
          <b>User-Friendly Interface:</b> Enjoy a seamless experience with PredictGpt&apos;s
          user-friendly interface, making financial education accessible to users of all backgrounds
          and expertise levels.
        </Typography>
        <Typography component="li">
          <b>Personalized Learning:</b> Tailor your financial knowledge journey with
          PredictGpt&apos;s personalized learning feature, adapting to your pace and preferences for
          a more effective learning experience.
        </Typography>
        <Typography component="li">
          <b>Cross-Platform Accessibility:</b> Access PredictGpt anytime, anywhere, as it is
          designed to be cross-platform, ensuring you can enhance your financial literacy on
          desktops, tablets, or mobile devices with ease.
        </Typography>
      </Typography>

      <Button
        variant="contained"
        sx={{ bgcolor: 'black', color: 'white', mt: 2 }}
        href="https://predictram-gpt.streamlit.app/"
        target="_blank"
      >
        Visit CGPU
      </Button>
    </Container>
  );
}
