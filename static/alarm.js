class AlarmClock {
    constructor() {
        this.alarms = JSON.parse(localStorage.getItem('alarms')) || [];
        this.currentTimeDisplay = document.querySelector('.current-time');
        this.alarmSound = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
        this.init();
    }

    init() {
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
        this.renderAlarms();
        this.setupEventListeners();
    }

    updateCurrentTime() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        this.currentTimeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        
        this.checkAlarms(hours, minutes);
    }

    checkAlarms(currentHours, currentMinutes) {
        this.alarms.forEach((alarm, index) => {
            if (alarm.hours === currentHours && alarm.minutes === currentMinutes && !alarm.triggered) {
                this.triggerAlarm(alarm);
                this.alarms[index].triggered = true;
                this.saveAlarms();
            }
        });
    }

    triggerAlarm(alarm) {
        this.alarmSound.play();
        alert(`Alarm: ${alarm.label || 'Time to wake up!'}`);
        this.alarmSound.pause();
        this.alarmSound.currentTime = 0;
    }

    addAlarm(hours, minutes, label) {
        this.alarms.push({
            hours: hours.padStart(2, '0'),
            minutes: minutes.padStart(2, '0'),
            label: label,
            triggered: false
        });
        this.saveAlarms();
        this.renderAlarms();
    }

    deleteAlarm(index) {
        this.alarms.splice(index, 1);
        this.saveAlarms();
        this.renderAlarms();
    }

    saveAlarms() {
        localStorage.setItem('alarms', JSON.stringify(this.alarms));
    }

    renderAlarms() {
        const alarmsList = document.querySelector('.alarms-list');
        alarmsList.innerHTML = '';
        
        this.alarms.forEach((alarm, index) => {
            const alarmItem = document.createElement('div');
            alarmItem.classList.add('alarm-item');
            
            alarmItem.innerHTML = `
                <div class="alarm-info">
                    <span class="alarm-time">${alarm.hours}:${alarm.minutes}</span>
                    <span class="alarm-label">${alarm.label || 'Alarm'}</span>
                </div>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            
            alarmsList.appendChild(alarmItem);
        });
    }

    setupEventListeners() {
        const form = document.querySelector('.alarm-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const hours = document.querySelector('#hours').value;
            const minutes = document.querySelector('#minutes').value;
            const label = document.querySelector('#label').value;
            
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                this.addAlarm(hours.toString(), minutes.toString(), label);
                form.reset();
            } else {
                alert('Please enter valid time values');
            }
        });

        document.querySelector('.alarms-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const index = e.target.dataset.index;
                this.deleteAlarm(index);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const alarmClock = new AlarmClock();
});
