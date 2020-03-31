
if (!Function.prototype.bind) {
  Function.prototype.bind = function () {
    let self = this,
      context = [].shift.call(arguments),
      args = [].slice.call(arguments);
    return function () {
      self.apply(context, [].concat.call(args, [].slice.call(arguments)));
    }
  }
}

class Timer {

  /**
   *
   * @param callback
   * @param time unit ms
   * @param limit count
   * @param delay first time
   */
  constructor(callback, time, limit, delay) {

    this.callback = callback;
    this.time = time;
    this.delay = delay;
    this.limitTemp = limit;
    this.timeoutId = null;
    this.intervalId = null;
    this.destroied = false;
    if (delay > 0) {
      this.timeoutId = this.startTimeout();
    } else {
      this.callback(this.limitTemp);
      this.intervalId = this.startInterval();
    }

  }

  startInterval() {
    this.destroied = false;
    return setInterval(() => {
      if (this.limitTemp == 0) {
        this.destroy();
        return
      }
      this.limitTemp--;
      if (!this.destroied){
        this.callback(this.limitTemp);
      }
    }, this.time)
  }

  startTimeout() {
    this.destroied = false;
    return setTimeout(() => {
      this.startInterval();
    }, this.delay);
  }

  destroy() {
    this.destroied = true;
    if (this.timeoutId){
      clearTimeout(this.timeoutId);
    }
    if (this.intervalId){
      clearInterval(this.intervalId);
    }
  }

}

export {Timer};
