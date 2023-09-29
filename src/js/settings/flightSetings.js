const os = require('os');
const fs = require('fs');
const path = require('path');

const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets');

const jsonData = JSON.parse(fs.readFileSync(folderPath + "\\flightOptions.json"), 'utf8')

window.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input")
    const applyButton = document.getElementById("applyButton")
    const resetButton = document.getElementById("resetButton")
    input.innerHTML = jsonData.flight_code;

    function saveJSON() {
        const flightData = {
            flight_code: input.value
        };

        fs.writeFileSync(folderPath + "\\flightOptions.json", JSON.stringify(flightData, null, 4))
    }

    applyButton.addEventListener('click', (event) => { 
        saveJSON()
    })

    resetButton.addEventListener('click', (event) => {
        console.log(1)
        input.value = ""

        saveJSON()
    })


})