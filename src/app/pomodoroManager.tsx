export interface PomodoroStep {
  limit: number;
  note: string;
}

export class PomodoroManager {
  private queue: PomodoroStep[] = [];
  private currentIndex: number = 0;
  private timeLeft: number = 0;
  private isRunning: boolean = false;
  private timeId: ReturnType<typeof setInterval> | null = null;

  private onTick?: (
    timeLeft: number,
    note: string,
    index: number,
    isRunning: boolean
  ) => void;

  constructor(queue: PomodoroStep[]) {
    this.queue = queue;
    if (queue.length > 0) {
      this.timeLeft = queue[0].limit;
    }
  }

  public setQueque(newQueue: PomodoroStep[]) {
    this.pause();
    this.queue = newQueue;
    this.currentIndex = 0;
    if (newQueue.length > 0) {
      this.timeLeft = newQueue[0].limit;
    }
    this.notify();
  }

  public subscribe(
    callback: (
      timeLeft: number,
      note: string,
      index: number,
      isRunning: boolean
    ) => void
  ) {
    this.onTick = callback;
  }

  public notify() {
    if (this.onTick && this.queue[this.currentIndex]) {
      this.onTick(
        this.timeLeft,
        this.queue[this.currentIndex].note,
        this.currentIndex,
        this.isRunning
      );
    }
  }

  public startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.notify();

    this.timeId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft -= 1;
        this.notify();
      } else {
        if (this.currentIndex < this.queue.length - 1) {
          this.currentIndex += 1;
          this.timeLeft = this.queue[this.currentIndex].limit;
          this.notify();
        } else {
          this.pause();
        }
      }
    }, 1000);
  }

  public pause() {
    this.isRunning = false;
    if (this.timeId) {
      clearInterval(this.timeId);
      this.timeId = null;
    }
    this.notify();
  }

  public clear() {
    this.pause();
    this.currentIndex = 0;
    if (this.queue.length > 0) {
      this.timeLeft = this.queue[0].limit;
    }
    this.notify();
  }
}
