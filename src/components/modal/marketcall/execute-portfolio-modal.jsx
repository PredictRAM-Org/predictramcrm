import { LoadingButton } from '@mui/lab';
import { Dialog, DialogContent, DialogTitle, Stack, TextField, Typography } from '@mui/material';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import React, { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import useScript from 'src/utils/useScript';

function ExecutePortfolioModal({ data, open, handleClose, livePriceLoading }) {
  useScript('https://kite.trade/publisher.js?v=3');

  const [rowModesModel, setRowModesModel] = useState({});
  const [rows, setRows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(null);
  const [isQuantityProvided, setIsQuantityProvided] = useState(false);

  useEffect(() => {
    if (data) {
      setRows(data);
      const hasQuantity = data.every((row) => row.quantity !== undefined && row.quantity !== null);
      setIsQuantityProvided(hasQuantity);
    }
  }, [data]);

  const allocateAmounts = useCallback(
    (rowsData, totalAmnt) =>
      rowsData.map((row) => {
        const allocatedAmount = (row.percentage / 100) * totalAmnt;
        const quantity = allocatedAmount / row.lp;
        return { ...row, quantity: Math.floor(quantity) };
      }),
    []
  );

  useEffect(() => {
    if (totalAmount > 0) {
      setRows((prevRows) => {
        const updatedRows = allocateAmounts(prevRows, totalAmount);
        const hasChanges = JSON.stringify(prevRows) !== JSON.stringify(updatedRows);
        return hasChanges ? updatedRows : prevRows;
      });
    }
  }, [totalAmount, allocateAmounts]);

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    { field: 'symbol', headerName: 'Stock Symbol', width: 300, editable: false },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      editable: true,
      width: 300,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 200,
      cellClassName: 'actions',
      align: 'right',
      headerAlign: 'right',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<Iconify icon="material-symbols:save" width={25} color="black" />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<Iconify icon="material-symbols:cancel" width={25} color="black" />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<Iconify icon="material-symbols:edit" width={25} color="black" />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<Iconify icon="material-symbols:delete-outline" width={25} color="black" />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Dialog maxWidth="md" fullWidth open={open} onClose={handleClose}>
      <DialogTitle>Edit and execute portfolio</DialogTitle>
      <DialogContent>
        <div>
          {!isQuantityProvided && (
            <Stack
              direction="row"
              spacing={2}
              paddingTop={2}
              alignItems="center"
              sx={{ marginBottom: 2 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Enter total amount you want to invest:
              </Typography>
              <TextField
                id="outlined-number"
                label="Total Amount"
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ width: '150px' }}
              />
            </Stack>
          )}
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slotProps={{
              toolbar: { setRows, setRowModesModel },
            }}
          />
          <form method="post" id="basket-form" action="https://kite.zerodha.com/connect/basket">
            <input type="hidden" name="api_key" value="s9f51ezxbxysuzna" />
            <input
              type="hidden"
              id="basket"
              name="data"
              value={JSON.stringify(
                rows?.map((row) => ({
                  variety: 'regular',
                  tradingsymbol: row?.symbol,
                  exchange: 'NSE',
                  transaction_type: row?.type,
                  order_type: 'MARKET',
                  quantity: row.quantity,
                  readonly: false,
                }))
              )}
            />
            <LoadingButton
              color="inherit"
              variant="contained"
              sx={{ mt: 2 }}
              type="Submit"
              disabled={!isQuantityProvided && totalAmount <= 0}
            >
              Execute Portfolio
            </LoadingButton>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExecutePortfolioModal;
