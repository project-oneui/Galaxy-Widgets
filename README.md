# Galaxy Widgets
An electron app which creates OneUI Widgets on your desktop

# Preview

![Preview Image](https://raw.githubusercontent.com/oneui-widgets/oneui-desktop-widgets/main/images/Preview.png)

# Possible Changes

- [ ] Widget Reworks | Currently working on it
- [ ] Adding more devices to the battery widgets
- [ ] Docs

# Usage

1. Download these files:
    - [latest release of Galaxy Widgets](https://github.com/project-oneui/Galaxy-Widgets/releases/latest)
    - [latest release of Galaxy Settings](https://github.com/project-oneui/Galaxy-Settings/releases/latest)
2. Run the setup files

# Optional Settings

## Battery Widget Setup (Phone and Tablet)
* [Phone](https://drive.google.com/file/d/107ltD-XbeErhqRqmJtPV9m9jLryLLOsk/view?usp=sharing)
* [Tablet](https://drive.google.com/file/d/1B6ujvNpErCDCxyPleFjrL-wuZtC32Cw9/view?usp=sharing)

1. On the bottom left in Tasker, click on the house and "Import Project"
2. Pick the downloaded file
3. Now in the bottom click on "OneUI Widgets"
4. Go to the "VAR" Tab and click on the clear space near the %DEVICE
5. Change it to your device name
6. Go to the "TASKS" Tab and click on "Send Battery Information"
7. Now click on "HTTP Post"
8. Replace local-ip with your PC's local IP
9. To get this, open cmd and type in "ipconfig /all" without the quotes
10. The IPv4-Adress should be your local ip. Not the one that ends with .1

# Credits
[@Keifufu](https://github.com/keifufu) Helping with retrieving the data for the music widget

# Disclaimer
This is not an official Samsung app!

# License
This script is provided under the [MIT License](https://github.com/project-oneui/Galaxy-Widgets/blob/main/LICENSE).
