class Timer {
  constructor(duration, onEnd) {
    this.duration = duration;
    this.onEnd = onEnd;
    this.timerId = null;
    this.timeLeft = duration;
    this.start();
  }

  start() {
    this.clear();
    this.timeLeft = this.duration;
    this.timerId = setTimeout(() => {
      if (this.onEnd) this.onEnd();
    }, this.duration * 1000);
  }

  reset() {
    this.start();
  }

  clear() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }
}

// ✅ Global timer for each round
window.RoundTimer = new Timer(10, () => {
  const event = new Event('autoSkip');
  window.dispatchEvent(event);
});
