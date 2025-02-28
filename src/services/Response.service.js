import { RESPONSE_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class ResponseService extends ApiService {
  constructor() {
    super(RESPONSE_URL);
  }
}

export default new ResponseService();
