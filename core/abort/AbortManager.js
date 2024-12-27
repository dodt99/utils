class AbortManager {
  abortControllers = {};

  register(key) {
    const controller = new AbortController();
    this.add(key, controller);
    return controller.signal;
  }

  add(key, controller) {
    if (this.abortControllers[key]) {
      this.abortControllers[key].push(controller);
    } else {
      this.abortControllers[key] = [controller];
    }
  }

  abort(key) {
    if (this.abortControllers[key]) {
      this.abortControllers[key].forEach((controller) => {
        controller.abort();
      });
      delete this.abortControllers[key];
    }
  }
}

export default new AbortManager();