import { doGet, doPost } from 'src/utils/apiCallers';

import { AUTH_URL } from 'src/config/api.config';

export default class AuthService {
  static async login(email, password) {
    const payload = { email, password };

    return doPost(`${AUTH_URL}/login`, payload);
  }

  static async checkUserAuth() {
    return doGet(`${AUTH_URL}/check`);
  }

  static async register(payload) {
    return doPost(`${AUTH_URL}/register`, payload);
  }

  static async changePassword(payload) {
    return doPost(`${AUTH_URL}/change-password`, payload);
  }

  static async sendOTP(payload) {
    return doPost(`${AUTH_URL}/send-otp`, payload);
  }

  static async resetPassword(payload) {
    return doPost(`${AUTH_URL}/reset-password`, payload);
  }
}
