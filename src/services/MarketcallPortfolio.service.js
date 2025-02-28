import { MARKET_CALL_PORTFOLIO_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class MarketCallPortfolioService extends ApiService {
  constructor() {
    super(MARKET_CALL_PORTFOLIO_URL);
  }
}

export default new MarketCallPortfolioService();
