import { PREDICTRAM_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class TaskService extends ApiService {
  constructor() {
    super(PREDICTRAM_URL);
  }

  getRiskScore(client) {
    return this.doGet(`${this._url}/risk-score/${client}`);
  }
}

export default new TaskService();
