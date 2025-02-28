import { Card, CardContent, CardHeader, Typography, Skeleton, Grid } from '@mui/material';

function StatCard({ heading, statNum, isLoading, onClick, lg, md, sm, xs, icon }) {
  return (
    <Grid item lg={lg || 3} md={md || 3} sm={sm || 6} xs={xs || 12}>
      <Card
        sx={{
          mx: 1,
          px: 1,
          pt: 1,
          height: '100%',
          cursor: !!onClick && 'pointer',
        }}
        onClick={onClick}
      >
        <CardHeader
          sx={{
            pb: 0,
          }}
          titleTypographyProps={{
            variant: 'subtitle2',
            fontWeight: 'bold',
            color: 'textSecondary',
          }}
          // avatar={icon}
          title={heading}
        />
        <CardContent
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isLoading ? (
            <Skeleton variant="text" animation="wave" sx={{ fontSize: '25px' }} width="50%" />
          ) : (
            <Typography variant="h3">{statNum.toLocaleString()}</Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

export default StatCard;
