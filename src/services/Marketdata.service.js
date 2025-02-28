import { MARKET_DATA_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class MarketDataService extends ApiService {
  constructor() {
    super(MARKET_DATA_URL);
  }

  history(symbol, resolution, fromDate, toDate) {
    return this.doGet(`${this._url}/history`, { symbol, resolution, fromDate, toDate });
  }

  livePrice(symbols) {
    return this.doGet(`${this._url}/live`, { symbols });
  }
}

export default new MarketDataService();
