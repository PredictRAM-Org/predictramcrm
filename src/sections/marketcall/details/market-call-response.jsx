import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';

import { Box, Button, Chip, Grid } from '@mui/material';

import cleanObject from 'src/utils/cleanObject';

import ResponseService from 'src/services/Response.service';
import PortfolioViewModal from 'src/components/modal/marketcall/portfolio-view-modal';
import {
  CLIENT_RESPONSE_STATUS_COLOR_MAP,
  CLIENT_TYPE,
  RESPONSE_STATUS,
  RESPONSE_STATUS_COLOR_MAP,
  ROLES,
} from 'src/enums';

import Iconify from 'src/components/iconify';
import { useSelector } from 'react-redux';
import BaseTable from 'src/components/table/BaseTable';
import ResponseStatusModal from 'src/components/modal/response/response-status-modal';

import MarketCallResponseFilter from './market-call-response-filter';

function MarketCallResponse() {
  const { id } = useParams();
  const { role } = useSelector((state) => state.user.details);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState({ page: 0, limit: 5 });
  const [responseId, setResponseId] = useState('');
  const [portfolioModal, setPortfolioModal] = useState(false);
  const [portfolioData, setPortfolioData] = useState([]);

  const handleModalClose = () => setModalOpen(false);

  const analystTableConfig = [
    {
      label: 'Execute Trade',
      accessor: ({ status, response }) => {
        if (response === 'ACCEPT' && status === RESPONSE_STATUS.INITIATED) {
          return (
            <Link to="https://www.kotaksecurities.com/#login" target="blank">
              <Iconify icon="akar-icons:link-out" />
            </Link>
          );
        }
        return 'N/A';
      },
    },
    {
      label: 'Change Status',
      accessor: ({ response, status, id: responseid }) => {
        if (response === 'ACCEPT' && status === RESPONSE_STATUS.INITIATED) {
          return (
            <Box
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                console.log(responseid);
                setResponseId(responseid);
                setModalOpen(true);
              }}
            >
              <Iconify icon="fluent-mdl2:sync-status-solid" />
            </Box>
          );
        }
        return 'N/A';
      },
    },
  ];

  const responseTableFormat = [
    {
      label: 'Name',
      accessor: ({ submittedBy }) => `${submittedBy?.firstName} ${submittedBy?.lastName}` || '-',
    },
    {
      label: 'Email',
      accessor: ({ submittedBy }) => submittedBy?.email || '-',
    },
    {
      label: 'Phone',
      accessor: ({ submittedBy }) => submittedBy?.phone || '-',
    },
    {
      label: 'Response',
      accessor: ({ response }) =>
        <Chip color={CLIENT_RESPONSE_STATUS_COLOR_MAP[response]} label={response} /> ||
        'Not Available',
    },
    {
      label: 'Status',
      accessor: ({ status }) =>
        <Chip color={RESPONSE_STATUS_COLOR_MAP[status]} label={status} /> || 'Not Available',
    },
    {
      label: 'Client Type',
      accessor: ({ submittedBy }) => CLIENT_TYPE[submittedBy?.client_type],
    },
    {
      label: 'Portfolio',
      accessor: ({ portfolio }) => (
        <Button
          onClick={() => {
            setPortfolioData(portfolio);
            setPortfolioModal(true);
          }}
        >
          View
        </Button>
      ),
    },
    ...(role === ROLES.ANALYST ? analystTableConfig : []),
  ];
  const { data, isLoading } = useQuery({
    queryKey: ['market-call-response', id, filter],
    queryFn: async () =>
      ResponseService.get(
        cleanObject({
          marketCallId: id,
          populate: 'submittedBy',
          ...filter,
        })
      ),
    select: (res) => res?.data,
  });

  return (
    <Grid container>
      <PortfolioViewModal
        handleClose={() => setPortfolioModal(false)}
        open={portfolioModal}
        data={portfolioData}
      />
      <ResponseStatusModal
        handleClose={handleModalClose}
        open={modalOpen}
        responseId={responseId}
        queryKey={['market-call-response', id, filter]}
      />

      <Grid item md={3} xs={12} paddingRight={{ md: 2, xs: 0 }} paddingBottom={{ md: 0, xs: 2 }}>
        <MarketCallResponseFilter setFilter={setFilter} filter={filter} />
      </Grid>
      <Grid item md={9} xs={12}>
        <BaseTable
          tableData={data?.responses || []}
          tableDataFormat={responseTableFormat}
          loading={isLoading}
          filterables={['email', 'phone', 'name', 'response']}
          filter={filter}
          setFilter={setFilter}
          customPagination
          customDocCount={data?.total}
        />
      </Grid>
    </Grid>
  );
}

export default MarketCallResponse;
