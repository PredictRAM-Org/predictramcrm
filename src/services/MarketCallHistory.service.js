import { MARKET_CALL_HISTORY_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class MarketCallHistoryService extends ApiService {
  constructor() {
    super(MARKET_CALL_HISTORY_URL);
  }
}

export default new MarketCallHistoryService();
