export default class CacheItem {
  value;
  slidingExpireTime;
  absoluteExpireTime;
  expireTime;

  constructor(value, slidingExpireTime, absoluteExpireTime) {
    this.value = value;
    this.slidingExpireTime = slidingExpireTime;
    this.absoluteExpireTime = absoluteExpireTime;

    const curTime = new Date().getTime();
    if (absoluteExpireTime) {
      this.expireTime = absoluteExpireTime;
    } else if (this.slidingExpireTime) {
      this.expireTime = curTime + this.slidingExpireTime;
    } else {
      this.expireTime = curTime + 15 * 60 * 1000; // 15 mins
    }
  }

  isExpired() {
    return this.expireTime <= new Date().getTime();
  }
}