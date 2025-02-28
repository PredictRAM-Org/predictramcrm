import { STOCK_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class StockService extends ApiService {
  constructor() {
    super(STOCK_URL);
  }
}

export default new StockService();
