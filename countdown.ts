export class Countdown {

  private dateSetTimeout: any;
  private secondsSetInterval: any;

  daysDiff: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(
    private timeUntil: Date,
    private showSeconds = true
  ) {
    this.setTimeUpdate();
    this.updateSeconds();
    clearInterval(this.secondsSetInterval);
    if (showSeconds) {
      this.secondsSetInterval = setInterval(() => this.updateSeconds(), 250);
    }
  }

  setTimeUntil(timeUntil = new Date()) {
    this.timeUntil = timeUntil;
    this.setTimeUpdate();
  }

  getTimeUntil() {
    return this.timeUntil;
  }

  private setTimeUpdate(): void {
    // console.log('setTimeUpdate', new Date());
    const now = new Date();
    const timeDiff = this.timeUntil.getTime() - now.getTime();
    const dayInMs = 1000 * 60 * 60 * 24;
    this.daysDiff = timeDiff / dayInMs;
    const modulo = this.daysDiff % 1;
    // this.days = this.config.showTime ? Math.floor(this.daysDiff) : Math.ceil(this.daysDiff);
    this.days = Math.floor(this.daysDiff);
    this.hours = Math.floor((modulo % 1) * 24);
    this.minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    this.seconds = Math.floor((timeDiff / 1000) % 60);
    if (this.days < 0) {
      this.days = 0;
    }
    const secondsToMinuteChange = 60 - (now.getSeconds() % 60);
    // this.changeDetectorRef.detectChanges();
    clearTimeout(this.dateSetTimeout);
    if (!this.showSeconds) {
      this.dateSetTimeout = setTimeout(() => {
        this.setTimeUpdate();
      }, secondsToMinuteChange <= 0 ? 200 : secondsToMinuteChange * 1000 - 300);
    }
  }

  private updateSeconds(): void {
    const date = new Date();
    if (date.getSeconds() === 0) {
      this.setTimeUpdate();
    }
    const newSeconds = 59 - date.getSeconds();
    if (newSeconds !== this.seconds) {
      this.seconds = newSeconds;
    }
  }
}
