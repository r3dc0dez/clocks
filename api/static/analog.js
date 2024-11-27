document.addEventListener('DOMContentLoaded', () => {
    const hourHand = document.querySelector('.hour-hand');
    const minuteHand = document.querySelector('.minute-hand');
    const secondHand = document.querySelector('.second-hand');
    
    function updateClock() {
        const now = new Date();
        
        const seconds = now.getSeconds();
        const secondsDegrees = ((seconds / 60) * 360) + 180;
        
        const minutes = now.getMinutes();
        const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 180;
        
        const hours = now.getHours();
        const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 180;
        
        secondHand.style.transform = `rotate(${secondsDegrees}deg)`;
        minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
        hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
    
    document.querySelectorAll('.number').forEach((number, index) => {
        const rotation = (index + 1) * 30;
        number.style.transform = `rotate(${rotation}deg) translate(0, -120px) rotate(-${rotation}deg)`;
    });
});
