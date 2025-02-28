import { LineWave } from 'react-loader-spinner';

import { Box } from '@mui/material';

export default function FetchLoader() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <LineWave
        visible
        height="200"
        width="200"
        color="#4791EA"
        ariaLabel="line-wave-loading"
        wrapperStyle={{}}
        wrapperClass=""
        firstLineColor=""
        middleLineColor=""
        lastLineColor=""
      />
    </Box>
  );
}
