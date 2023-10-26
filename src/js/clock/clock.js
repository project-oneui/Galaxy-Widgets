function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

window.addEventListener("DOMContentLoaded", () => {
    function getOrdinalSuffix(number) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = number % 100;
        return number + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    function setTimeDate() {
        const currentDate = new Date();
        const time = pad(currentDate.getHours()) + ":" + pad(currentDate.getMinutes())
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",];
        const date = dayNames[currentDate.getDay()] + ", " + getOrdinalSuffix(currentDate.getDate()) + " " + monthNames[currentDate.getMonth()]
        
        document.getElementById('date').innerHTML = date;
        document.getElementById('time').innerHTML = time;
    }

    setTimeDate()
    setInterval(setTimeDate, 1000)
})