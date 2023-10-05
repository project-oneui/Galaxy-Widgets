> [!IMPORTANT]
> 
> 
> If you get any error: Try to delete all files except the temp folder in: %localappdata%\Samsung-Widgets.


# Samsung Widgets
An electron app which creates OneUI Widgets on your desktop

# Preview

![Preview Image](https://raw.githubusercontent.com/oneui-widgets/oneui-desktop-widgets/main/images/Preview.png)

# Checklist

- [x] Widget Positioning
- [x] Tasker Preset (Phone)
- [x] Tasker Preset (Tablet)
- [x] Weather Location in Settings
- [x] Disable Widgets in Settings
- [x] Flight WIdget
- [x] Calendar Widget
- [ ] Galaxy Watch on Battery Widget (I dont own one currently but im thinking about getting one)
- [ ] Untis Widget

# How to use

## Install the Samsung Settings App
1. Download the [latest release](github.com/project-oneui/Samsung-Settings/releases/latest)
2. Run the .exe

## Install the Background Service

1. Install the [latest version](https://github.com/project-oneui/oneui-desktop-widgets-service/releases/latest)
2. Unpack the zip
3. Run the bat file

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

# This is not an official Samsung app!
