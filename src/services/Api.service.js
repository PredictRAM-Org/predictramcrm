import axios from 'axios';

import joinUrlPath from 'src/utils/joinUrlPath';
import { doGet, doPut, doPost, doPatch, doDelete, doGetById } from 'src/utils/apiCallers';

const getDefaultParams = () => {};

class ApiService {
  _url = '';

  constructor(url) {
    this._url = url;
    this._headers = {};

    this.cancelToken = axios.CancelToken.source();

    this.doPost = doPost;

    this.doGet = doGet;
    this.doGetById = doGetById;

    this.doPut = doPut;
    this.doPatch = doPatch;

    this.doDelete = doDelete;
  }

  post(payload, params, headers) {
    return doPost(this._url, payload, params, { ...this._headers, ...headers });
  }

  get(params, headers, noOrgId) {
    const _params = { ...params, ...getDefaultParams() };
    if (noOrgId) delete _params.organizationId;

    return this.doGet(
      this._url,
      _params,
      {
        ...this._headers,
        ...headers,
      },
      this.cancelToken
    );
  }

  getById(id, params, headers) {
    const _params = { ...params, ...getDefaultParams() };
    return this.doGetById(`${this._url}/${id}`, _params, {
      ...this._headers,
      ...headers,
    });
  }

  put(id, payload, params, headers) {
    return this.doPut(joinUrlPath(this._url, id), payload, params, {
      ...this._headers,
      ...headers,
    });
  }

  delete(id, params, headers) {
    const url = id ? joinUrlPath(this._url, id) : this._url;
    return this.doDelete(url, params, {
      ...this._headers,
      ...headers,
    });
  }

  patch(id, payload, params, headers) {
    return this.doPatch(joinUrlPath(this._url, id), payload, params, {
      ...this._headers,
      ...headers,
    });
  }
}

export default ApiService;
