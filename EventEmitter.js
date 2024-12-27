class EventEmitter {
  events = {};

  dispatch = (event, data = null) => {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].forEach((callback) => {
      callback(data);
    });
  };

  subscribe = (event, callback) => {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  };

  unsubscribe = (event, callback) => {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event] = this.events[event].filter((func) => func !== callback);
  };
}

export default new EventEmitter();
