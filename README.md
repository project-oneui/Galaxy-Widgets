> [!IMPORTANT]  
> If you get any error: Try to delete all files except the temp folder in: %localappdata%\oneui-widgets

# oneui-desktop-widgets
An electron app which creates OneUI Widgets on your desktop

# Preview

![Preview Image](https://raw.githubusercontent.com/oneui-widgets/oneui-desktop-widgets/main/images/Preview.png)

# How to use

## Install the application itself
1. Install the latest zip file of the [Releases](https://github.com/oneui-widgets/oneui-desktop-widgets/releases/latest)
2. Unpack it, the best place would be the documents folder
3. Create a shortcut of the .exe
4. Press Windows + R and type in shell:startup
5. Put here the Shortcut
6. Now install the [Background Service](https://github.com/oneui-widgets/oneui-desktop-widgets-service/releases/latest)
7. Unpack the zip
8. Run the bat file

### Optional Settings

## Music Widget Setup (only Spotify)
1. Make sure you have spotify installed from the official website not the Microsoft Store. Here's the download: https://www.spotify.com/de/download/other/
2. Install spicetify, to do this enter these two commands into Powershell
```
iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-cli/master/install.ps1 | iex
```

```
iwr -useb https://raw.githubusercontent.com/spicetify/spicetify-marketplace/main/resources/install.ps1 | iex
```
3. After that and go on Marketplace on the left. Go to the extensions tab if not selected. Then search on the top right for WebNowPlaying-Redux-Spicetify. Click on the Result and in the top right you can install it. Click on Reload Now
4. Click on your profile name/icon on the top right and select WebNowPlaying
5. Add a custom adapter and put 8943 as the port

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

# If any problems occur open a issue or contact psoi on discord
