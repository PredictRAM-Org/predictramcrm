import ReactApexChart from 'react-apexcharts';

import FetchLoader from '../loader/fetch-loader';

const StockChart = ({
  data = [],
  height = 100,
  tooltip = true,
  title,
  titleAlign = 'left',
  loading = false,
}) => {
  const state = {
    series: [
      {
        data,
      },
    ],
    options: {
      chart: {
        type: 'candlestick',
        height,
      },
      ...(title && {
        title: {
          text: title,
          align: titleAlign,
        },
      }),
      xaxis: {
        type: 'datetime',
      },
      yaxis: {
        tooltip: {
          enabled: tooltip,
        },
      },
    },
  };

  if (loading) return <FetchLoader />;

  return (
    <ReactApexChart
      options={state.options}
      series={state.series}
      type="candlestick"
      height={height}
    />
  );
};

export default StockChart;
