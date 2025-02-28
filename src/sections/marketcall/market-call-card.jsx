import PropTypes from 'prop-types';
import Grid from '@mui/material/Unstable_Grid2';
import { Card, CardContent, Typography, Box, Avatar, Stack, Button, Link } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useState } from 'react';
import Iconify from 'src/components/iconify';
import parse from 'html-react-parser';

// ----------------------------------------------------------------------

export default function MarketCallCard({ marketCall, buttonText }) {
  const { createdBy, portfolio, _id: id, title, description } = marketCall;
  const router = useRouter();

  const renderCreatedBy = (
    <Typography>
      by{' '}
      <Link
        href={`/profile/${createdBy?.username}`}
        underline="hover"
        target="_blank"
        color="inherit"
      >{`${createdBy.firstName} ${createdBy.lastName}`}</Link>
    </Typography>
  );
  const renderTitle = (
    <Typography fontWeight="bold" fontSize={20}>
      {title}
    </Typography>
  );

  const renderDescription = (
    <Typography>
      {description.length > 100 ? parse(`${description?.slice(0, 100)}...`) : parse(description)}
    </Typography>
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? portfolio.length - 1 : prevIndex - 1));
  };

  const handleNextClick = () => {
    setCurrentIndex((prevIndex) => (prevIndex === portfolio.length - 1 ? 0 : prevIndex + 1));
  };

  const renderButton = (
    <Button
      variant="contained"
      color="inherit"
      sx={{ mt: 1, width: '100%' }}
      onClick={() => router.push(`/market-call/details/${id}`)}
    >
      {buttonText}
    </Button>
  );

  const renderImage = (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#DCDEEE"
      sx={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
    >
      {portfolio.length > 0 && portfolio[currentIndex].image ? (
        <Stack alignItems="center" p={2} height={250}>
          <Typography variant="h5">
            {portfolio[currentIndex].type} Call For {portfolio[currentIndex].symbol}
          </Typography>
          <img src={portfolio[currentIndex].image} alt="market-call" height={200} />
        </Stack>
      ) : (
        <Box height={250} display="flex" alignItems="center" textAlign="center">
          <Typography variant="h5">
            {portfolio[currentIndex].type} Call For {portfolio[currentIndex].symbol}
          </Typography>
        </Box>
      )}
    </Box>
  );

  // const renderPortfolioStocks = () => {
  //   const stocks = portfolio.map((item) => item.symbol);
  //   const displayStocks = stocks.slice(0, 2).join(', ');
  //   const remainingCount = stocks.length - 2;

  //   return (
  //     <Typography variant="body2">
  //       Portfolio stocks: {displayStocks}
  //       {remainingCount > 0 ? ` + ${remainingCount} more` : ''}
  //     </Typography>
  //   );
  // };

  return (
    <Grid xs={12} sm={6} md={4}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          },
        }}
      >
        <Card sx={{ position: 'relative', borderRadius: 0 }}>
          <Box position="relative">
            {renderImage}
            <Button
              onClick={handlePrevClick}
              sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}
            >
              <Iconify icon="material-symbols:arrow-left-alt" />
            </Button>
            <Button
              onClick={handleNextClick}
              sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
            >
              <Iconify icon="material-symbols:arrow-right-alt" />
            </Button>
          </Box>
        </Card>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={
                createdBy?.image ||
                `https://ui-avatars.com/api/?name=${createdBy?.firstName}+${createdBy?.lastName}`
              }
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {renderCreatedBy}
            </Typography>
          </Box>

          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '64px',
            }}
          >
            {renderTitle}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {renderDescription}
          </Typography>

          <p>{renderButton}</p>
        </CardContent>
        {/* {renderPortfolioStocks()} */}
      </Card>
    </Grid>
  );
}

MarketCallCard.propTypes = {
  marketCall: PropTypes.object.isRequired,
  buttonText: PropTypes.string.isRequired,
};
