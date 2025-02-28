import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import React from 'react';
import BaseTable from 'src/components/table/BaseTable';
import { MARKET_CALL_TYPES } from 'src/enums';

function PortfolioViewModal({ open, handleClose, data = [] }) {
  const tableFormat = [
    { label: 'Symbol', accessor: 'symbol' },
    {
      label: 'Call Duration',
      accessor: ({ durationType }) => MARKET_CALL_TYPES[durationType],
    },
    { label: 'Call Type', accessor: 'type' },
    {
      label: 'Buy Price',
      accessor: ({ buyPrice }) => `${buyPrice} /-`,
    },
    {
      label: 'Target Price',
      accessor: ({ targetPrice }) => `${targetPrice} /-`,
    },
    {
      label: 'Stop Loss Price',
      accessor: ({ stopLossPrice }) => `${stopLossPrice} /-`,
    },
  ];
  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Portfolio Stocks</DialogTitle>
      <DialogContent>
        <BaseTable
          cardStyle={{ boxShadow: 0, borderRadius: 1 }}
          tableData={data || []}
          //   loading={marketCallLoading}
          tableDataFormat={tableFormat}
          customDocCount={data?.length}
        />
      </DialogContent>
    </Dialog>
  );
}

export default PortfolioViewModal;
