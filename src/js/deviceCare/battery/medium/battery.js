const battery = require("battery");

window.addEventListener("DOMContentLoaded", () => {
    const circularProgress = document.querySelectorAll(".circular-progress");
    const icon = document.querySelectorAll('.icon')
    const name = document.querySelectorAll('.name')

    async function setInfo() {
        var i = 0;
        Array.from(circularProgress).forEach((progressBar) => {
            const innerCircle = progressBar.querySelector(".inner-circle");
            innerCircle.style.backgroundColor = `${progressBar.getAttribute("data-inner-circle-color")}`;

            let progressColor = progressBar.getAttribute("data-progress-color");

            // Set border for every progressh
            progressBar.style.background = `conic-gradient(${progressColor} ${0 * 3.6
                }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;

            // check if first run if yes then set laptop battery
            if (i == 0) {
                try {
                    (async () => {
                        const { level } = await battery();
                        const percentage = level * 100;

                        if (percentage <= 20) {
                            progressColor = "#f2736f"
                        }

                        circularProgress[i].style.background = `conic-gradient(${progressColor} ${percentage * 3.6
                            }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
                    })();
                } catch { }

                i++
                // return to start of loop
                return;
            }

            const phonePath = path.join(folderPath, 'temp', "batteryPhoneInfo.json");
            const tabletPath = path.join(folderPath, 'temp', "batteryTabletInfo.json");

            function setIconSource(icon, iconSource) {
                icon.src = iconSource;
            }

            function setProgressBarStyle(progressBar, progressColor, battery) {
                progressBar.style.background = `conic-gradient(${progressColor} ${battery * 3.6
                    }deg,${progressBar.getAttribute("data-bg-color")} 0deg)`;
            }

            function setName(nameElement, name) {
                nameElement.innerHTML = name;
            }

            function setBattery(filePath, iconSource) {
                let progressBar = circularProgress[i];
                if (fs.existsSync(filePath)) {
                    try {
                        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                        // if battery lower than 20% then red color (#f2736f) else the standard progress color
                        let progressColor = data.battery_percentage <= 20 ? "#f2736f" : progressBar.getAttribute("data-progress-color");

                        setProgressBarStyle(progressBar, progressColor, data.battery_percentage);
                        setIconSource(icon[i], iconSource);
                        setName(name[i], data.phone_name || data.tablet_name);
                        i++
                    } catch (error) {
                        console.error(`Error reading ${filePath}: ${error.message}`);
                    }
                }
            }

            setBattery(phonePath, "../../../../res/ic_oui_phone.webp")
            setBattery(tabletPath, "../../../../res/ic_oui_tablet.webp")

            // reset counter to start again
            i = 0;
        })
    }


    setInfo();
    setInterval(setInfo, 1000 * 60)

})