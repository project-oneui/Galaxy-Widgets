const os = require('os')
const fs = require('fs')
const path = require('path')
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets', 'temp');

window.addEventListener("DOMContentLoaded", () => {
    function setDeviceCareInfo() {
        const jsonData = JSON.parse(fs.readFileSync(folderPath + '\\deviceCareInfo.json', 'utf8'));
        document.getElementById("info-used-memory").innerHTML = ((os.totalmem() - os.freemem()) / 1073741824).toFixed(1) + "GB";
        document.getElementById("info-existing-memory").innerHTML = "/ " + (os.totalmem() / 1073741824).toFixed() + "GB";
        document.getElementById("info-progress-memory").style.width = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100 + "%";
        document.getElementById("info-used-storage").innerHTML = (jsonData.Used / 1073741824).toFixed(1) + "GB";
        document.getElementById("info-existing-storage").innerHTML = "/ " + (jsonData.Existing / 1073741824).toFixed() + "GB";
        document.getElementById("info-progress-storage").style.width = (jsonData.Used / jsonData.Existing) * 100 + "%";
    }

    setDeviceCareInfo();
    setInterval(setDeviceCareInfo, 1000 * 30)
})
