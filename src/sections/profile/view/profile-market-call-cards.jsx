import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Card, TablePagination } from '@mui/material';

import cleanObject from 'src/utils/cleanObject';

import NotFound from 'src/components/Nofound';
import FetchLoader from 'src/components/loader/fetch-loader';
import ProfileMarketcallService from 'src/services/ProfileMarketcall.service';
import ProfileMarketCallCard from '../profile-market-call-card';

function ProfileMarketCallCards({ filter, setFilter }) {
  const [page, setPage] = useState(filter?.page);
  const [limit, setLimit] = useState(filter?.limit);

  const { data = [], isLoading } = useQuery({
    queryKey: ['market-call', cleanObject(filter)],
    queryFn: () => {
      setPage(filter?.page);
      setLimit(filter?.limit);
      return ProfileMarketcallService.get(
        cleanObject({
          ...filter,
          populate: 'createdBy',
        })
      );
    },
    select: (res) => res?.data || [],
  });

  const handleChangePage = (event, newPage) => {
    setFilter({ ...filter, page: newPage, limit });
  };

  const handleChangeRowsPerPage = (event) => {
    const value = parseInt(event.target.value, 10);
    setLimit(value);
    setFilter({ ...filter, page: 0, limit: value });
  };

  if (isLoading) return <FetchLoader />;

  if ((data?.marketCall || [])?.length === 0)
    return (
      <NotFound
        sx={{ mt: 10 }}
        title="Opps! no  market call found"
        subtitle="Connect Your Analyst or Employee To Create MarketCall for You"
      />
    );

  return (
    <div>
      <Grid2 container spacing={3}>
        {(data?.marketCall || [])?.map((marketCall) => (
          <ProfileMarketCallCard key={marketCall._id} marketCall={marketCall} buttonText="View Details" />
        ))}
      </Grid2>
      <Box sx={{ maxWidth: 'fit-content', margin: 'auto' }}>
        <Card sx={{ mt: 2 }}>
          <TablePagination
            page={page}
            component="div"
            count={data?.total}
            rowsPerPage={limit}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Box>
    </div>
  );
}

export default ProfileMarketCallCards;
