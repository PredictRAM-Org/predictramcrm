import { doPost } from 'src/utils/apiCallers';

import { KYC_URL } from 'src/config/api.config';

export default class KycService {
  static async esign() {
    return doPost(`${KYC_URL}/esign`);
  }

  static async ekyc(data) {
    return doPost(`${KYC_URL}/ekyc`, data);
  }

  static async ekycVerify(data) {
    return doPost(`${KYC_URL}/ekyc-verify`, data);
  }

  // static async ekycReport(document_id) {
  //   return doGet(
  //     `${KYC_URL}/ekyc/report`,
  //     { document_id },
  //     {
  //       responseType: 'blob',
  //     }
  //   );
  // }

  // static async esignDoc(document_id) {
  //   return doGet(
  //     `${KYC_URL}/esign/doc`,
  //     { document_id },
  //     {
  //       responseType: 'blob',
  //     }
  //   );
  // }
}
