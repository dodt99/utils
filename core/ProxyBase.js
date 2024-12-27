import api from "./api";
import abortManager from "./abort/AbortManager";
import cacheManager from "./cache/CacheManager";

export default class ProxyBase {
  request(config = {}, options = {}) {
    const { disableAbort = false, appendAbortKey = "" } = options;
    const abortKey = config.url + appendAbortKey;

    let signal;
    if (!disableAbort) {
      abortManager.abort(abortKey);
      signal = abortManager.register(abortKey);
    }

    return api.request({ signal, ...config }).then((data) => {
      if (!disableAbort) {
        abortManager.abort(abortKey);
      }
      return data;
    });
  }

  getData = (promiseAction) => {
    return new Promise((resolve, reject) => {
      promiseAction()
        .then((response) => {
          return resolve(response.data);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  };

  applyCache =
    (key, params = {}, expireTime) =>
    (promiseAction) => {
      const lang = "en";
      const cacheKey = key + JSON.stringify({ lang, ...params }).replace(/[}{'.":]/g, "");

      const cacheItem = cacheManager.get(cacheKey);
      if (cacheItem) {
        return new Promise((resolve) => resolve(cacheItem));
      }

      return promiseAction().then((response) => {
        const data = response.data;
        cacheManager.add(cacheKey, data, expireTime);
        return data;
      });
    };
}