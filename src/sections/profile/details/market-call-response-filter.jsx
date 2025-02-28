import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { Card, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';

import EnumAutocomplete from 'src/components/AutoComplete/EnumAutoComplete';
import ResponseStatusAutoComplete from 'src/components/AutoComplete/ResonseStatusAutocomplete';

function MarketCallResponseFilter({ setFilter, filter }) {
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    setFilter({ ...filter, response, status, page: 0 });
  };

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <Stack sx={{ padding: 3, gap: 2 }}>
          <Typography variant="h6" marginBottom="10px">
            Filters
          </Typography>
          <ResponseStatusAutoComplete
            name="status"
            noLabel
            value={status}
            onChange={(_, v) => setStatus(v)}
            placeholder="Select Status"
          />
          <EnumAutocomplete
            name="response"
            noLabel
            ENUM={['ACCEPT', 'REJECT']}
            onChange={(_, v) => setResponse(v)}
            placeholder="Select Response"
            value={response}
          />
          <LoadingButton fullWidth size="large" type="submit" variant="contained" color="inherit">
            Apply
          </LoadingButton>
        </Stack>
      </Card>
    </form>
  );
}

export default MarketCallResponseFilter;
