import { TASK_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class TaskService extends ApiService {
  constructor() {
    super(TASK_URL);
  }

  changeAnalyst(id, payload) {
    return this.doPut(`${this._url}/assign-new-analyst/${id}`, payload);
  }

  getAnalystTask(params) {
    return this.doGet(`${this._url}/analyst-task`, params);
  }

  getTaskCount(params) {
    return this.doGet(`${this._url}/count`, params);
  }

  getAnalystTaskCount(params) {
    return this.doGet(`${this._url}/analyst/count`, params);
  }

  getAllAnalystTaskCount(params) {
    return this.doGet(`${this._url}/all-analyst/count`, params);
  }
}

export default new TaskService();
