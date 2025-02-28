import { MARKET_CALL_PROFILE_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class ProfileMarketCallService extends ApiService {  
  constructor() {
    super(MARKET_CALL_PROFILE_URL);
  }
}

export default new ProfileMarketCallService();
