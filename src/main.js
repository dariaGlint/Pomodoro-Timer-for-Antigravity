import './style.css'

class PomodoroTimer {
  constructor() {
    // Default Settings
    this.settings = {
      workTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      longBreakInterval: 4
    };

    // State
    this.timeLeft = this.settings.workTime * 60;
    this.isRunning = false;
    this.timerId = null;
    this.mode = 'work'; // 'work', 'shortBreak', 'longBreak'
    this.pomodorosCompleted = 0;

    // DOM Elements
    this.timerDisplay = document.getElementById('timer-display');
    this.startBtn = document.getElementById('start-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.statusIndicator = document.getElementById('status-indicator');

    // Settings DOM
    this.settingsBtn = document.getElementById('settings-btn');
    this.settingsModal = document.getElementById('settings-modal');
    this.closeModalBtn = document.getElementById('close-modal-btn');
    this.saveSettingsBtn = document.getElementById('save-settings-btn');
    this.inputs = {
      work: document.getElementById('work-time'),
      shortBreak: document.getElementById('short-break-time'),
      longBreak: document.getElementById('long-break-time'),
      interval: document.getElementById('long-break-interval')
    };

    this.initEventListeners();
    this.updateDisplay();
    this.requestNotificationPermission();
  }

  initEventListeners() {
    this.startBtn.addEventListener('click', () => this.toggleTimer());
    this.resetBtn.addEventListener('click', () => this.resetTimer());

    // Settings Modal
    this.settingsBtn.addEventListener('click', () => this.openSettings());
    this.closeModalBtn.addEventListener('click', () => this.closeSettings());
    this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

    // Close modal on outside click
    this.settingsModal.addEventListener('click', (e) => {
      if (e.target === this.settingsModal) this.closeSettings();
    });
  }

  requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
      this.requestNotificationPermission(); // Ask again if needed
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
    this.timeLeft = this.settings.workTime * 60;
    this.updateDisplay();
    this.statusIndicator.textContent = 'Ready to focus?';
  }

  completeTimer() {
    this.pauseTimer();
    this.sendNotification();

    if (this.mode === 'work') {
      this.pomodorosCompleted++;

      if (this.pomodorosCompleted % this.settings.longBreakInterval === 0) {
        this.mode = 'longBreak';
        this.timeLeft = this.settings.longBreakTime * 60;
        this.statusIndicator.textContent = 'Time for a long break!';
        alert('Great job! Take a long break.');
      } else {
        this.mode = 'shortBreak';
        this.timeLeft = this.settings.shortBreakTime * 60;
        this.statusIndicator.textContent = 'Time for a short break!';
        alert('Work session complete! Take a short break.');
      }
    } else {
      // Break is over
      this.mode = 'work';
      this.timeLeft = this.settings.workTime * 60;
      this.statusIndicator.textContent = 'Back to work!';
      alert('Break over! Ready to focus?');
    }
    this.updateDisplay();
  }

  sendNotification() {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = this.mode === 'work' ? 'Time for a break!' : 'Back to work!';
      new Notification('Pomodoro Timer', {
        body: title,
        icon: '/vite.svg'
      });
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    this.timerDisplay.textContent = timeString;

    // Update Title
    const modeLabel = this.mode === 'work' ? 'Focus' : 'Break';
    document.title = `${timeString} - ${modeLabel}`;
  }

  // Settings Methods
  openSettings() {
    this.inputs.work.value = this.settings.workTime;
    this.inputs.shortBreak.value = this.settings.shortBreakTime;
    this.inputs.longBreak.value = this.settings.longBreakTime;
    this.inputs.interval.value = this.settings.longBreakInterval;
    this.settingsModal.classList.remove('hidden');
  }

  closeSettings() {
    this.settingsModal.classList.add('hidden');
  }

  saveSettings() {
    this.settings.workTime = parseInt(this.inputs.work.value) || 25;
    this.settings.shortBreakTime = parseInt(this.inputs.shortBreak.value) || 5;
    this.settings.longBreakTime = parseInt(this.inputs.longBreak.value) || 15;
    this.settings.longBreakInterval = parseInt(this.inputs.interval.value) || 4;

    this.closeSettings();

    // If timer is not running, reset to apply new settings immediately (if in work mode)
    if (!this.isRunning && this.mode === 'work') {
      this.resetTimer();
    }
  }
}

new PomodoroTimer();
