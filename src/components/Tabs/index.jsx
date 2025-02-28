import { Card, Stack, Button } from '@mui/material';

function Tabs({ currentTab, setCurrentTab, tabConfig, sx, color = 'inherit' }) {
  return (
    <Stack direction="row" gap={2} sx={sx}>
      {tabConfig?.map((tab) => (
        <Card sx={{ display: 'inline-block', borderRadius: 1 }}>
          <Button
            color={color}
            variant={currentTab === tab?.index ? 'contained' : 'outlined'}
            onClick={() => setCurrentTab(tab?.index)}
          >
            {tab.label}
          </Button>
        </Card>
      ))}
    </Stack>
  );
}

export default Tabs;
