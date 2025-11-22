import './style.css'

class PomodoroTimer {
  constructor() {
    this.timeLeft = 25 * 60;
    this.isRunning = false;
    this.timerId = null;
    this.mode = 'work'; // 'work' or 'break'

    this.timerDisplay = document.getElementById('timer-display');
    this.startBtn = document.getElementById('start-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.statusIndicator = document.getElementById('status-indicator');

    this.startBtn.addEventListener('click', () => this.toggleTimer());
    this.resetBtn.addEventListener('click', () => this.resetTimer());

    this.updateDisplay();
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.startBtn.textContent = 'Pause';
    this.timerId = setInterval(() => {
      this.timeLeft--;
      this.updateDisplay();
      if (this.timeLeft <= 0) {
        this.completeTimer();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    this.startBtn.textContent = 'Start';
    clearInterval(this.timerId);
  }

  resetTimer() {
    this.pauseTimer();
    this.mode = 'work';
    this.timeLeft = 25 * 60;
    this.updateDisplay();
    this.statusIndicator.textContent = 'Ready to focus?';
  }

  completeTimer() {
    this.pauseTimer();
    // TODO: Play sound
    if (this.mode === 'work') {
      this.mode = 'break';
      this.timeLeft = 5 * 60;
      this.statusIndicator.textContent = 'Time for a break!';
      alert('Work session complete! Take a break.');
    } else {
      this.mode = 'work';
      this.timeLeft = 25 * 60;
      this.statusIndicator.textContent = 'Back to work!';
      alert('Break over! Ready to focus?');
    }
    this.updateDisplay();
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    this.timerDisplay.textContent = timeString;
    document.title = `${timeString} - Pomodoro`;
  }
}

new PomodoroTimer();
