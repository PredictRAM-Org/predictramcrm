import { Box, Button } from '@mui/material';

import Iconify from '../iconify';

function FileFormat({ gid, showCSV = true, showXLSX = true, showSample = true, children, sx }) {
  const baseLink =
    'https://docs.google.com/spreadsheets/d/1l4bTw9jxFG3NOaJc46v6mjqcfLvcLt0y-2DUqsxjzYs';
  const viewLink = `${baseLink}/edit#gid=${gid}`;
  const downloadXLSXLink = `${baseLink}/export?format=xlsx&gid=${gid}`;
  const downloadCSVLink = `${baseLink}/export?format=csv&gid=${gid}`;
  return (
    <Box sx={{ display: 'flex', gap: 2, flexDirection: { md: 'row', xs: 'column' }, ...sx }}>
      {showSample && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="material-symbols:arrow-outward" />}
          onClick={() => window.open(viewLink)}
        >
          Show Sample File
        </Button>
      )}
      {showCSV && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="material-symbols:sim-card-download-rounded" />}
          onClick={() => window.open(downloadCSVLink)}
        >
          Download Sample CSV
        </Button>
      )}
      {showXLSX && (
        <Button
          variant="outlined"
          startIcon={<Iconify icon="material-symbols:sim-card-download-rounded" />}
          onClick={() => window.open(downloadXLSXLink)}
        >
          Download Sample Excel
        </Button>
      )}
      {children}
    </Box>
  );
}

export default FileFormat;
