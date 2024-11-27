let currentTimezone = 'UTC';
let clockInterval;

const locationInput = document.getElementById('locationInput');
const suggestionsDiv = document.getElementById('suggestions');
const currentLocationDiv = document.getElementById('currentLocation');
const currentTimeDiv = document.getElementById('currentTime');
const currentDateDiv = document.getElementById('currentDate');
const clickSound = new Audio('/static/sounds/click.mp3');

function updateClock() {
    fetch(`/get_time?timezone=${encodeURIComponent(currentTimezone)}`)
        .then(response => response.json())
        .then(data => {
            currentTimeDiv.textContent = data.time;
            currentDateDiv.textContent = data.date;
            currentLocationDiv.textContent = data.timezone.split('/').pop().replace(/_/g, ' ');
        })
        .catch(error => console.error('Error:', error));
}

function createSuggestionItem(location) {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'suggestion-name';
    nameSpan.textContent = location.name;
    
    const typeSpan = document.createElement('span');
    typeSpan.className = 'suggestion-type';
    typeSpan.textContent = location.type;
    
    div.appendChild(nameSpan);
    div.appendChild(typeSpan);
    
    if (location.type === 'country') {
        div.onclick = () => {
            clickSound.play();
            selectLocation(location.timezones[0], location.name);
        };
    } else {
        div.onclick = () => {
            clickSound.play();
            selectLocation(location.timezone, location.name);
        };
    }
    
    return div;
}

locationInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 2) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`/search_locations?q=${encodeURIComponent(query)}`);
        const locations = await response.json();
        
        suggestionsDiv.innerHTML = '';
        locations.forEach(location => {
            const suggestionItem = createSuggestionItem(location);
            suggestionsDiv.appendChild(suggestionItem);
        });
        
        suggestionsDiv.style.display = locations.length > 0 ? 'block' : 'none';
    } catch (error) {
        console.error('Error:', error);
    }
});

function selectLocation(timezone, displayName) {
    currentTimezone = timezone;
    locationInput.value = displayName;
    suggestionsDiv.style.display = 'none';
    
    if (clockInterval) {
        clearInterval(clockInterval);
    }
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
}

document.addEventListener('click', (e) => {
    if (!locationInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.style.display = 'none';
    }
});

locationInput.addEventListener('keydown', (e) => {
    const items = suggestionsDiv.getElementsByClassName('suggestion-item');
    const activeItem = suggestionsDiv.querySelector('.suggestion-item.active');
    
    if (items.length === 0) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        let nextItem;

        if (!activeItem) {
            nextItem = e.key === 'ArrowDown' ? items[0] : items[items.length - 1];
        } else {
            const currentIndex = Array.from(items).indexOf(activeItem);
            const nextIndex = e.key === 'ArrowDown' 
                ? (currentIndex + 1) % items.length
                : (currentIndex - 1 + items.length) % items.length;
            nextItem = items[nextIndex];
            activeItem.classList.remove('active');
        }

        nextItem.classList.add('active');
        nextItem.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && activeItem) {
        e.preventDefault();
        clickSound.play();
        activeItem.click();
    } else if (e.key === 'Escape') {
        suggestionsDiv.style.display = 'none';
    }
});

updateClock();
clockInterval = setInterval(updateClock, 1000);
