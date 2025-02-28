import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Card, Grid, Alert, Stack, Button, Container, CardHeader, Typography } from '@mui/material';

import BaseTable from 'src/components/table/BaseTable';
import StockAutocomplete from 'src/components/AutoComplete/StockAutocomplete';

export default function HedgeOSPage() {
  const [stocks, setStocks] = useState('');
  const [hagdeResult, setHadgeResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handelHedge = async (e) => {
    e.preventDefault();
    setHadgeResult([]);
    try {
      setLoading(true);
      const { data } = await axios.post(
        'https://hedgeos-fzfhabegevgdercr.z02.azurefd.net/v2/hedge',
        {
          tickers: stocks,
        },
        {
          headers: {
            username: 'prabal.chow09009.pc@gmail.com',
            token: '$2a$10$6fm2NMr6yEPGtNZOFdwb4eJkNGfuJpSD5xM2xWDMg3ms7DUWUNAeO',
          },
        }
      );
      setHadgeResult(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      sx={{
        // mt: 3,
        bgcolor: 'white',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        borderRadius: '8px',
        position: 'relative',
        top: '64px',
      }}
    >
      <img
        src="/assets/photo_6307612031041255745_y.jpg"
        alt="HedgeOS"
        style={{
          width: '500px',
          alignContent: 'center',
          alignItems: 'center',
          height: 'auto',
          borderRadius: '8px 8px 0 0',
          marginBottom: '16px',
        }}
      />
      <form onSubmit={handelHedge} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <StockAutocomplete
          noLabel
          multiple
          value={stocks}
          onChange={(_, v) => setStocks(v)}
          placeholder="Select Stocks"
        />
        <Button variant="contained" type="submit" disabled={!stocks.length}>
          Submit
        </Button>
      </form>
      <Stack gap={2} marginY={1}>
        {/* {loading && <Loader />} */}
        {!loading &&
          hagdeResult?.map((info) => (
            <Card key={info?.stock_details['Stock Symbol']}>
              <CardHeader
                title={
                  <Typography fontSize={20} color="#3293F6" fontWeight="bold">
                    Best Hedging and Best Performing Stocks for{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {info?.stock_details['Stock Symbol']}
                    </span>
                  </Typography>
                }
              />
              <Stack gap={1} margin={2}>
                {info?.best_hedging_stock ? (
                  <Alert severity="info" sx={{ fontSize: 15 }}>
                    Best Hedging Stock is{' '}
                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                      {info?.best_hedging_stock['Stock Symbol']}
                    </span>
                  </Alert>
                ) : (
                  <Alert severity="warning">Sorry no hedging stock found</Alert>
                )}
                {info?.best_performing_stock ? (
                  <Alert severity="info" sx={{ fontSize: 15 }}>
                    Best Performing Stock is{' '}
                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                      {info?.best_performing_stock['Stock Symbol']}
                    </span>
                  </Alert>
                ) : (
                  <Alert severity="warning">Sorry no hedging stock found</Alert>
                )}
                <Typography fontSize="18px" fontWeight="bold">
                  Missed Return is <span style={{ color: 'green' }}>+ {info?.missed_return} %</span>
                </Typography>

                <Grid item md={9} xs={12}>
                  <BaseTable
                    tableData={Object.keys(info?.stock_details)?.map((key) => ({
                      Parameters: key,
                      [info?.stock_details?.['Stock Symbol']]: info?.stock_details?.[key] ?? 'N/A',
                      [info?.best_hedging_stock?.['Stock Symbol'] ?? 'N/A']:
                        info?.best_hedging_stock?.[key] ?? 'N/A',
                      [info?.best_performing_stock?.['Stock Symbol'] ?? 'N/A']:
                        info?.best_performing_stock?.[key] ?? 'N/A',
                    }))}
                    tableDataFormat={[
                      'Parameters',
                      info?.stock_details?.['Stock Symbol'],
                      info?.best_hedging_stock?.['Stock Symbol'] ?? 'N/A',
                      info?.best_performing_stock?.['Stock Symbol'] ?? 'N/A',
                    ].map((c) => ({ label: c, accessor: c }))}
                    loading={loading}
                  />
                </Grid>
              </Stack>
            </Card>
          ))}
      </Stack>
    </Container>
  );
}
