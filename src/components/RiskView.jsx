import { Typography } from '@mui/material';
import React from 'react';

const portfolioResults = [
  {
    status: 'Very Conservative',
    color: '#7ECF82',
    desc: 'As a very conservative investor, your portfolio will be invested in the most risk-averse areas such as cash and fixed income securities. This approach offers a high degree of stability and should minimize the chances of substantial short-term volatility. Your main goal is preservation of wealth. The overall return, while not guaranteed, should fall within a narrow range of possibilities. However, particularly for time periods greater than five years, these returns may underperform the returns achievable from a higher-risk approach',
  },
  {
    status: 'Conservative',
    color: '#7ECF82',
    desc: 'As a conservative investor, your portfolio will be invested primarily in risk-averse areas such as cash and fixed-income securities with only a modest exposure to equities. This approach concentrates on stability rather than maximizing return and should limit the chances of substantial short-term volatility. The overall return, while not guaranteed, should fall within a relatively narrow range of possibilities. However, particularly for time periods greater than five years, these returns may underperform the returns achievable from a higher-risk approach',
  },
  {
    status: 'Moderate',
    color: '#ffdf00',
    desc: 'As a moderate investor, your portfolio will include investment in equities, balanced by exposure to more risk-averse areas of the market such as cash, fixed-income securities, and real estate. This approach aims to achieve a balance between stability and return but is likely to involve at least some short-term volatility. The overall return is not guaranteed, although the range of possible outcomes should not be extreme. In most circumstances, particularly for time periods greater than five years, these returns should outperform the returns achievable from a more conservative approach but may underperform the returns achievable from a higher-risk approach',
  },
  {
    status: 'Aggressive',
    color: '#F2AF33',
    desc: 'As an moderately aggressive investor, your portfolio will be invested primarily in equities. This approach concentrates on achieving a good overall return on your investment while avoiding the most speculative areas of the market. Significant short-term fluctuations in value can be expected. The eventual return for the time period over which you invest could fall within a relatively wide range of possibilities. In most circumstances, particularly for time periods greater than five years, these returns should outperform the returns achievable from a more conservative approach',
  },
  {
    status: 'Very Aggressive',
    color: '#F55050',
    desc: 'As a very aggressive investor, your portfolio will be invested in equities and will include exposure to more speculative areas of the market. The aim is to maximize return while accepting the possibility of large short-term fluctuations in value and even the possibility of longer-term losses. The eventual return for the time period over which you invest could fall within a wide range of possibilities. In most circumstances, the return should outperform the returns achievable from a more conservative approach',
  },
];

function RiskView({ riskScore, headerText }) {
  const calculateResult = (score) => {
    if (score < 15) {
      return portfolioResults[0];
    }
    if (score >= 15 && score < 20) {
      return portfolioResults[1];
    }
    if (score >= 20 && score < 25) {
      return portfolioResults[2];
    }
    if (score >= 25 && score < 30) {
      return portfolioResults[3];
    }
    return portfolioResults[4];
  };
  return (
    <Typography fontWeight="semiBold">
      {headerText}
      <Typography color={calculateResult(riskScore).color}>
        {calculateResult(riskScore).status}
      </Typography>
    </Typography>
  );
}

export default RiskView;
