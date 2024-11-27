class BombTimer {
    constructor() {
        this.display = document.querySelector('.timer-display');
        this.timeLeft = 0;
        this.initialTime = 0;
        this.timerId = null;
        this.isRunning = false;
        this.warningThreshold = 10; // seconds
        this.explosionSound = new Audio('https://actions.google.com/sounds/v1/impacts/crash.ogg');
        this.tickSound = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.isRunning = true;
            this.timerId = setInterval(() => this.tick(), 1000);
            document.querySelector('.start-btn').textContent = 'Pause';
        } else if (this.isRunning) {
            this.pause();
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
        document.querySelector('.start-btn').textContent = 'Start';
    }

    reset() {
        this.pause();
        this.timeLeft = this.initialTime;
        this.updateDisplay();
        this.display.classList.remove('warning');
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= this.warningThreshold) {
                this.display.classList.add('warning');
                this.tickSound.play();
            }
            
            if (this.timeLeft === 0) {
                this.explode();
            }
        }
    }

    explode() {
        this.pause();
        this.explosionSound.play();
        alert('BOOM! Time\'s up!');
        this.reset();
    }

    updateDisplay() {
        const hours = Math.floor(this.timeLeft / 3600);
        const minutes = Math.floor((this.timeLeft % 3600) / 60);
        const seconds = this.timeLeft % 60;
        
        this.display.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    setTime(hours, minutes, seconds) {
        this.initialTime = (hours * 3600) + (minutes * 60) + seconds;
        this.timeLeft = this.initialTime;
        this.updateDisplay();
    }

    setupEventListeners() {
        const form = document.querySelector('.timer-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const hours = parseInt(document.querySelector('#hours').value) || 0;
            const minutes = parseInt(document.querySelector('#minutes').value) || 0;
            const seconds = parseInt(document.querySelector('#seconds').value) || 0;
            
            if (hours >= 0 && minutes >= 0 && seconds >= 0) {
                this.setTime(hours, minutes, seconds);
                form.reset();
            }
        });

        document.querySelector('.start-btn').addEventListener('click', () => this.start());
        document.querySelector('.stop-btn').addEventListener('click', () => this.pause());
        document.querySelector('.reset-btn').addEventListener('click', () => this.reset());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bombTimer = new BombTimer();
});
