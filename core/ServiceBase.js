import ProxyBase from "./ProxyBase";

export class ServiceBase extends ProxyBase {
  get(url = "", params = {}, options = {}) {
    const {
      config = {},
      disableAbort = false,
      appendAbortKey = "",
      applyCache = false,
      expireTime,
    } = options;

    const promiseAction = () =>
      this.request({ method: "GET", url, params, ...config }, { disableAbort, appendAbortKey });

    return applyCache
      ? this.applyCache(url, params, expireTime)(promiseAction)
      : this.getData(promiseAction);
  }

  post(url = "", data = {}, options = {}) {
    const {
      config = {},
      disableAbort = false,
      appendAbortKey = "",
      applyCache = false,
      expireTime,
    } = options;

    const promiseAction = () =>
      this.request({ method: "POST", url, data, ...config }, { disableAbort, appendAbortKey });

    return applyCache
      ? this.applyCache(url, data, expireTime)(promiseAction)
      : this.getData(promiseAction);
  }

  put(path = "", data = {}, config = {}) {
    return this.request({ method: "PUT", url: path, data, ...config });
  }

  delete(path = "", data = {}, config = {}) {
    return this.request({ method: "DELETE", url: path, data, ...config });
  }
}