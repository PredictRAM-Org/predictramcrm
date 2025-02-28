import { USER_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class UserService extends ApiService {
  constructor() {
    super(USER_URL);
  }

  linkEmployee(payload) {
    return this.doPut(`${USER_URL}/employee/LINK`, payload);
  }

  unlinkEmployee(payload) {
    return this.doPut(`${USER_URL}/employee/UNLINK`, payload);
  }
}

export default new UserService();
