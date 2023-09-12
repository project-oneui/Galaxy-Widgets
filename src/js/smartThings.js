window.addEventListener("DOMContentLoaded", () => {
    const mainContainer = document.getElementById("container-main")
    const deviceIcon = document.getElementById("device-icon")

    function Test() {
        if (mainContainer.style.backgroundColor == "var(--background-secondary)") {
            mainContainer.style.backgroundColor = "var(--background)"
            deviceIcon.src = "../res/smartThings/bulb/bulb_on.svg"
        } else {
            mainContainer.style.backgroundColor = "var(--background-secondary)"
            deviceIcon.src = "../res/smartThings/bulb/bulb_off.svg"
        }
        
    }

    setInterval(Test, 5000)
})