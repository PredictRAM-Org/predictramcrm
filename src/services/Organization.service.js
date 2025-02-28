import { ORGANIZATION_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class OrganizationService extends ApiService {
  constructor() {
    super(ORGANIZATION_URL);
  }
}

export default new OrganizationService();
