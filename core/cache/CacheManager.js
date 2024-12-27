import CacheItem from "./CacheItem";

class CacheManager {
  cache = {};

  add(key, value, slidingExpireTime, absoluteExpireTime) {
    this.cache[key] = new CacheItem(value, slidingExpireTime, absoluteExpireTime);
  }

  get(key) {
    this.removeExpired();
    const cacheItem = this.cache[key];
    return cacheItem ? cacheItem.value : null;
  }

  removeExpired() {
    Object.keys(this.cache).forEach((k) => {
      if (this.cache[k].isExpired()) {
        this.remove(k);
      }
    });
  }

  remove(key) {
    delete this.cache[key];
  }

  flush() {
    Object.keys(this.cache).forEach((k) => {
      this.remove(k);
    });
    this.cache = {};
  }
}

export default new CacheManager();