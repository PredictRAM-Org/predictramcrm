import { NOTIFICATION_URL } from 'src/config/api.config';

import ApiService from './Api.service';

class NotificationService extends ApiService {  
  constructor() {
    super(NOTIFICATION_URL);
  }
}

export default new NotificationService();
