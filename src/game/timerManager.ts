import type { AdventureLevelDefinition } from './levelManager';
//Handles the countdown timer for levels, including starting, pausing, resuming, and stopping the timer. 
// It also provides callbacks for each tick and when time is up.
export class TimerManager {
  private durationSeconds: number;
  private remainingSeconds: number;
  private intervalId: number | null = null;
  private isRunning: boolean = false;
  private onTickCallback?: (remaining: number, formatted: string, progressFraction: number) => void;
  private onTimeUpCallback?: () => void;

  constructor(durationSeconds: number) {
    this.durationSeconds = durationSeconds;
    this.remainingSeconds = durationSeconds;
  }

  public setDuration(seconds: number): void {
    this.durationSeconds = seconds;
    this.remainingSeconds = seconds;
  }

  public setLevel(level: AdventureLevelDefinition, extraSeconds: number = 0): void {
    this.setDuration(level.difficultySettings.timeLimit + extraSeconds);
  }

  public start(
    onTick?: (remaining: number, formatted: string, progressFraction: number) => void,
    onTimeUp?: () => void,
  ): void {
    this.stop();
    if (onTick) this.onTickCallback = onTick;
    if (onTimeUp) this.onTimeUpCallback = onTimeUp;

    this.isRunning = true;
    this.triggerTick();

    this.intervalId = window.setInterval(() => {
      if (!this.isRunning) return;
      this.remainingSeconds -= 1;
      this.triggerTick();

      if (this.remainingSeconds <= 0) {
        this.stop();
        if (this.onTimeUpCallback) {
          this.onTimeUpCallback();
        }
      }
    }, 1000);
  }

  public pause(): void {
    this.isRunning = false;
  }

  public resume(): void {
    if (this.remainingSeconds > 0 && !this.isRunning) {
      this.isRunning = true;
    }
  }

  public stop(): void {
    this.isRunning = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public reset(): void {
    this.stop();
    this.remainingSeconds = this.durationSeconds;
    this.triggerTick();
  }

  public addSeconds(seconds: number): void {
    this.remainingSeconds = Math.min(this.durationSeconds, this.remainingSeconds + seconds);
    this.triggerTick();
  }

  public getRemainingSeconds(): number {
    return this.remainingSeconds;
  }

  public getFormattedTime(): string {
    const mins = Math.floor(Math.max(0, this.remainingSeconds) / 60);
    const secs = Math.max(0, this.remainingSeconds) % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private triggerTick(): void {
    if (this.onTickCallback) {
      const fraction = this.durationSeconds > 0 ? this.remainingSeconds / this.durationSeconds : 0;
      this.onTickCallback(this.remainingSeconds, this.getFormattedTime(), fraction);
    }
  }
}
