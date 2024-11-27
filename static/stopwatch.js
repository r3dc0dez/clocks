class Stopwatch {
    constructor(display) {
        this.display = display;
        this.running = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.intervalId = null;
        this.laps = [];
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.intervalId = setInterval(() => this.updateDisplay(), 10);
        }
    }

    stop() {
        if (this.running) {
            this.running = false;
            clearInterval(this.intervalId);
            this.elapsedTime = Date.now() - this.startTime;
        }
    }

    reset() {
        this.running = false;
        clearInterval(this.intervalId);
        this.elapsedTime = 0;
        this.startTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapList();
    }

    lap() {
        const lapTime = this.elapsedTime;
        this.laps.push(lapTime);
        this.updateLapList();
    }

    updateDisplay() {
        const currentTime = this.running ? Date.now() - this.startTime : this.elapsedTime;
        const time = new Date(currentTime);
        const minutes = time.getUTCMinutes().toString().padStart(2, '0');
        const seconds = time.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = Math.floor(time.getUTCMilliseconds() / 10).toString().padStart(2, '0');
        this.display.textContent = `${minutes}:${seconds}.${milliseconds}`;
    }

    updateLapList() {
        const lapList = document.querySelector('.lap-list');
        lapList.innerHTML = '';
        
        this.laps.forEach((lapTime, index) => {
            const lapItem = document.createElement('div');
            lapItem.classList.add('lap-item');
            
            const time = new Date(lapTime);
            const minutes = time.getUTCMinutes().toString().padStart(2, '0');
            const seconds = time.getUTCSeconds().toString().padStart(2, '0');
            const milliseconds = Math.floor(time.getUTCMilliseconds() / 10).toString().padStart(2, '0');
            
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${index + 1}</span>
                <span class="lap-time">${minutes}:${seconds}.${milliseconds}</span>
            `;
            
            lapList.insertBefore(lapItem, lapList.firstChild);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const display = document.querySelector('.display');
    const stopwatch = new Stopwatch(display);

    document.querySelector('.start').addEventListener('click', () => stopwatch.start());
    document.querySelector('.stop').addEventListener('click', () => stopwatch.stop());
    document.querySelector('.reset').addEventListener('click', () => stopwatch.reset());
    document.querySelector('.lap').addEventListener('click', () => stopwatch.lap());
});
