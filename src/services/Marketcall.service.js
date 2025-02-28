import { MARKET_CALL_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class MarketCallService extends ApiService {  
  constructor() {
    super(MARKET_CALL_URL);
  }
}

export default new MarketCallService();
