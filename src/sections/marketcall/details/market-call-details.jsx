import { isAfter } from 'date-fns';
import toast from 'react-hot-toast';
// import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useConfirm } from 'material-ui-confirm';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// import { LoadingButton } from '@mui/lab';
import { Alert, Avatar, Box, Button, Card, MenuItem, Stack, Typography } from '@mui/material';

// import ResponseService from 'src/services/Response.service';
import MarketdataService from 'src/services/Marketdata.service';
import MarketcallService from 'src/services/Marketcall.service';
import { MARKET_CALL_TYPES, ROLES } from 'src/enums';

// import AccessControl from 'src/components/Accesscontrol';
import FetchLoader from 'src/components/loader/fetch-loader';
import BaseTable from 'src/components/table/BaseTable';
import { useState } from 'react';
import ImageViewModal from 'src/components/modal/Image/image-view-modal';
import Iconify from 'src/components/iconify';
import StockService from 'src/services/Stock.service';
import StockAddEditModal from 'src/components/modal/marketcall/stock-add-edit-modal';
import MarketCallEditModal from 'src/components/modal/marketcall/marketcall-edit-modal';
import AccessControl from 'src/components/Accesscontrol';
import ResponseService from 'src/services/Response.service';
import { LoadingButton } from '@mui/lab';
import { useSelector } from 'react-redux';
import ExecutePortfolioModal from 'src/components/modal/marketcall/execute-portfolio-modal';
import parse from 'html-react-parser';

// import ReactMarkdown from 'react-markdown';
// import useScript from 'src/utils/useScript';

const confirmObj = (title, description, confirmationText) => ({
  title: <h3 style={{ margin: 0 }}>{title}</h3>,
  description: <h4 style={{ margin: 0 }}>{description}</h4>,
  cancellationButtonProps: { variant: 'contained', color: 'error', autoFocus: false },
  confirmationButtonProps: { variant: 'contained', color: 'success' },
  confirmationText,
});

const isLive = (endDate) => isAfter(new Date(endDate), new Date());

export default function MarketCallDetails() {
  const { id } = useParams();
  const confirm = useConfirm();
  const queryClient = useQueryClient();
  const { id: userId, role } = useSelector((state) => state.user.details);
  const [showImage, setShowImage] = useState(false);
  const [stockEditId, setStockEditId] = useState(null);
  const [stockAddEdit, setStockAddEdit] = useState(false);
  const [edit, setEdit] = useState(false);
  const [execute, setExecute] = useState(false);
  // useScript('https://kite.trade/publisher.js?v=3');

  const { data: marketCall = {}, isLoading: marketCallLoading } = useQuery({
    queryKey: ['market-call', id],
    queryFn: async () => {
      const { data } = await MarketcallService.get({
        _id: id,
        populate: 'createdBy,clients',
      });
      return data;
    },
    select: (res) => res?.marketCall?.[0],
  });

  const { data: marketLivePrice = [], isLoading: livePriceLoading } = useQuery({
    queryKey: ['live-price', id, marketCall?.portfolio?.map(({ symbol }) => symbol)],
    queryFn: async () => {
      const stocks = marketCall?.portfolio?.map((stockInfo) => stockInfo?.symbol).join(',');
      const { data } = await MarketdataService.livePrice(stocks);
      const stockWithPrice = marketCall?.portfolio?.map((stockData) => {
        const priceData = data?.d?.find((d) => d?.n === `NSE:${stockData?.symbol}-EQ`);
        return {
          ...stockData,
          high_price: priceData?.v?.high_price || 'Not Found',
          low_price: priceData?.v?.low_price || 'Not Found',
          lp: priceData?.v?.lp || 'Not Found',
          open_price: priceData?.v?.open_price || 'Not Found',
          prev_close_price: priceData?.v?.prev_close_price || 'Not Found',
        };
      });
      return stockWithPrice;
    },

    refetchInterval: isLive(marketCall?.endDate) ? 1000 * 15 : 0,
    enabled: marketCall?.portfolio?.length > 0,
  });

  const { mutate: submitResponse } = useMutation({
    mutationFn: (payload) => ResponseService.post({ marketCallId: id, ...payload }),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      toast.success('Your Response is submitted');
      queryClient.invalidateQueries(['market-call', id]);
    },
  });

  const handelResponseSubmit = async (response) => {
    await confirm(
      confirmObj(
        `Are you sure you want to ${response} this call ?`,
        'You can not revert back',
        `Yes, ${response}`
      )
    );
    const payload = {
      marketCallId: id,
      response,
    };

    submitResponse({ ...payload });
  };

  const { mutate: removeStock } = useMutation({
    mutationFn: (deleteStockId) => StockService.delete(deleteStockId),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      queryClient.invalidateQueries(['market-call']);
    },
  });

  // TODO: do it based on selected clients in next update
  const { mutate: sendNotification } = useMutation({
    mutationFn: () =>
      MarketcallService.put(id, { notifiedClients: marketCall?.clients?.map(({ _id }) => _id) }),
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      toast.success('Notification Sent To Client');
      queryClient.invalidateQueries(['market-call']);
    },
  });

  const { mutate: subscribeMarketcall, isPending } = useMutation({
    mutationFn: () => {
      const clients = marketCall?.clients?.map((client) => client._id) ?? [];
      return MarketcallService.put(id, { clients: [...clients, userId] });
    },
    onError: (err) => toast.error(err.message),
    onSuccess: () => {
      toast.success('Subscribed successfully');
      queryClient.invalidateQueries(['market-call']);
    },
  });

  const tableFormat = [
    { label: 'Symbol', accessor: 'symbol' },
    {
      label: 'Call Duration',
      accessor: ({ durationType }) => MARKET_CALL_TYPES[durationType],
    },
    { label: 'Call Type', accessor: 'type' },
    { label: 'LTP', accessor: ({ lp }) => (typeof lp === 'number' ? `${lp} /-` : lp) },
    {
      label: 'Buy Price',
      accessor: ({ buyPrice }) => (buyPrice ? `${buyPrice} /-` : 'NA'),
    },
    {
      label: 'Target Price',
      accessor: ({ targetPrice }) => (targetPrice ? `${targetPrice} /-` : 'NA'),
    },
    {
      label: 'Stop Loss Price',
      accessor: ({ stopLossPrice }) => (stopLossPrice ? `${stopLossPrice} /-` : 'NA'),
    },
    {
      label: 'Quantity or Percentage',
      accessor: ({ quantity, percentage }) => {
        if (quantity !== undefined) {
          return `Quantity: ${quantity}`;
        }
        if (percentage !== undefined) {
          return `Percentage: ${percentage}`;
        }
        return 'N/A';
      },
    },
    {
      label: 'Research Image',
      accessor: ({ image, symbol }) =>
        image ? <Button onClick={() => setShowImage({ image, symbol })}>View</Button> : 'No Image',
    },
  ];

  const clientTableFormat = [
    {
      label: 'Name',
      accessor: ({ firstName, avatar, lastName }) => (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            alt={firstName}
            src={avatar || `https://ui-avatars.com/api/?name=${firstName}+${lastName}`}
          />
          <Typography variant="subtitle2" noWrap>
            {`${firstName} ${lastName}`}
          </Typography>
        </Stack>
      ),
    },

    { label: 'Phone', accessor: 'phone' },
    { label: 'Email', accessor: 'email' },
    {
      label: 'Notified And Can Accept/Reject',
      accessor: ({ _id }) => (marketCall?.notifiedClients?.includes(_id) ? 'Yes' : 'No'),
    },
  ];

  const renderCreatedBy = (
    <Typography fontSize={15} color="gray">
      Created by {`${marketCall?.createdBy?.firstName} ${marketCall?.createdBy?.lastName}`}
    </Typography>
  );
  const renderTitle = (
    <Typography fontWeight="bold" fontSize={40}>
      {marketCall?.title}
    </Typography>
  );

  const renderDescription = (
    // <ReactMarkdown>
    //   {marketCall?.description || ''}
    // </ReactMarkdown>
    <Typography>{parse(marketCall?.description || '')}</Typography>
  );

  const portfolioTable = (
    <BaseTable
      cardStyle={{ boxShadow: 0, borderRadius: 1 }}
      tableData={marketLivePrice || []}
      loading={livePriceLoading}
      tableDataFormat={tableFormat}
      customDocCount={marketCallLoading?.length}
      actions={
        role === ROLES.ANALYST
          ? [
              (d) => (
                <MenuItem
                  onClick={() => {
                    setStockEditId(d?.id);
                    setStockAddEdit(true);
                  }}
                >
                  <Iconify icon="ic:baseline-edit" sx={{ mr: 1 }} style={{ color: '#f4e53e' }} />
                  Edit
                </MenuItem>
              ),
              (d) => (
                <MenuItem
                  onClick={async () => {
                    await confirm(
                      confirmObj(`Do You Want to Remove ${d?.symbol} ?`, '', 'Yes, Remove Stock')
                    );
                    removeStock(d?.id);
                  }}
                >
                  <Iconify icon="mdi:delete" style={{ color: '#f43e3e' }} sx={{ mr: 2 }} /> Delete
                </MenuItem>
              ),
            ]
          : null
      }
    />
  );

  const renderClientTable = (
    <BaseTable
      cardStyle={{ boxShadow: 0, borderRadius: 1 }}
      tableData={marketCall?.clients || []}
      loading={marketCallLoading}
      tableDataFormat={clientTableFormat}
      customDocCount={marketCallLoading?.length}
    />
  );

  const renderAddStock = (
    <Button variant="contained" color="inherit" onClick={() => setStockAddEdit(true)}>
      <Iconify icon="material-symbols:add" style={{ color: 'white' }} sx={{ mr: 2 }} />
      Add Stock
    </Button>
  );

  const renderEdit = (
    <Button size="small" variant="outlined" color="inherit" onClick={() => setEdit(true)}>
      <Iconify icon="ic:baseline-edit" sx={{ mr: 1 }} />
      Edit Market Call
    </Button>
  );
  const renderNotify = (
    <Button
      variant="contained"
      color="inherit"
      onClick={async () => {
        await confirm(
          confirmObj(
            `Do You Want to send Notification to clients ?`,
            'Clients will be notified and they can accept/reject',
            'Yes, Notify'
          )
        );
        sendNotification();
      }}
    >
      <Iconify icon="mingcute:notification-fill" style={{ color: 'white' }} sx={{ mr: 2 }} />
      Notify Clients
    </Button>
  );

  const renderClientActions = (
    <Stack direction="row" gap={1}>
      <LoadingButton
        variant="contained"
        color="success"
        sx={{ width: 1 }}
        // onClick={() => handelResponseSubmit('ACCEPT')}
        onClick={() => setExecute(true)}
      >
        Accept
      </LoadingButton>
      <LoadingButton
        variant="contained"
        color="error"
        sx={{ width: 1 }}
        onClick={() => handelResponseSubmit('REJECT')}
      >
        Reject
      </LoadingButton>
    </Stack>
  );

  if (marketCallLoading) return <FetchLoader />;

  const isUserSubscribed = marketCall?.clients?.some((client) => client._id === userId);

  return (
    <Box>
      <ImageViewModal
        open={showImage?.image}
        handleClose={() => setShowImage(false)}
        msg={`Research Image for ${showImage?.symbol}`}
        alt="Market Call Image"
        src={showImage?.image}
      />
      {stockAddEdit && (
        <StockAddEditModal
          open={stockAddEdit}
          handleClose={() => {
            setStockAddEdit(false);
            setStockEditId(null);
          }}
          id={stockEditId}
        />
      )}
      <MarketCallEditModal
        open={edit}
        handleClose={() => setEdit(false)}
        calldata={{ ...marketCall }}
      />
      <ExecutePortfolioModal
        open={execute}
        handleClose={() => setExecute(false)}
        data={marketLivePrice}
        livePriceLoading={livePriceLoading}
      />
      <Card sx={{ p: 3 }}>
        <Stack alignItems="start" direction="row" justifyContent="space-between">
          {renderTitle}
          <Stack alignItems="end">
            <AccessControl accepted_roles={[ROLES.ANALYST]}>{renderEdit}</AccessControl>
            {renderCreatedBy}
            {role === 'CLIENT' && !isUserSubscribed && (
              <LoadingButton
                color="inherit"
                variant="contained"
                sx={{ mt: 2 }}
                loading={isPending}
                onClick={subscribeMarketcall}
              >
                <Iconify
                  icon="mingcute:notification-fill"
                  style={{ color: 'white' }}
                  sx={{ mr: 1 }}
                />
                Subscribe
              </LoadingButton>
            )}
            {role === 'CLIENT' && isUserSubscribed && (
              <Button
                color="success"
                variant="contained"
                disabled
                sx={{ mt: 2 }}
                loading={isPending}
                onClick={subscribeMarketcall}
              >
                <Iconify
                  icon="mingcute:notification-fill"
                  // style={{ color: 'white' }}
                  sx={{ mr: 1 }}
                />
                Subscribed
              </Button>
            )}
          </Stack>
        </Stack>
        {renderDescription}

        <Stack my={2} direction="row" justifyContent="space-between">
          <Typography variant="h4">Portfolio Stocks</Typography>
          <AccessControl accepted_roles={[ROLES.ANALYST]}>{renderAddStock}</AccessControl>
        </Stack>

        {portfolioTable}

        <AccessControl accepted_roles={[ROLES.ANALYST]}>
          <Stack my={2} direction="row" justifyContent="space-between">
            <Typography variant="h4">Subscribed Clients</Typography>
            {renderNotify}
          </Stack>

          {renderClientTable}
        </AccessControl>
        <AccessControl accepted_roles={[ROLES.CLIENT]}>
          {marketCall?.notifiedClients?.includes(userId) ? (
            renderClientActions
          ) : (
            <Alert color="info">You can Accept or Reject When Your Analyst will notify You</Alert>
          )}
        </AccessControl>
        {/* <kite-button
          href="/market-call/details/66f7885218f851981e7762af"
          data-kite="n6thdkwid9aee5bo"
          data-exchange="NSE"
          data-tradingsymbol="SBIN"
          data-transaction_type="BUY"
          data-quantity="1"
          data-order_type="MARKET"
        >
          Buy SBI stock
        </kite-button> */}
        {/* <kite-button
          href="#"
          data-kite="s9f51ezxbxysuzna"
          data-exchange="NSE"
          data-tradingsymbol="SBIN"
          data-transaction_type="BUY"
          data-quantity="1"
          data-order_type="MARKET"
        >
          Buy SBI stock
        </kite-button> */}
      </Card>
    </Box>
  );
}
