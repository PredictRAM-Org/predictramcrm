import { PROFILE_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class ProfileService extends ApiService {  
  constructor() {
    super(PROFILE_URL);
  }
}

export default new ProfileService();
