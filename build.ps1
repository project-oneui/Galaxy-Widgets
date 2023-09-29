# Define the path to candle.exe and light.exe
$candlePath = "C:\Program Files (x86)\WiX Toolset v3.11\bin\candle.exe"
$lightPath = "C:\Program Files (x86)\WiX Toolset v3.11\bin\light.exe"

# Set the source directory
$sourceDir = "D:\a\oneui-desktop-widgets\samsung-widgets\samsung-widgets-win32-x64"

# Compile the WiX source file into .wixobj files
& $candlePath "-o" "build/windows/" "samsung-widgets.wxs" "-dSourceDir=$sourceDir"

# Link the .wixobj files into an MSI installer
& $lightPath "build\windows\*.wixobj" "-o" "bin\samsung-widgets.msi"

Write-Output "MSI Installer Created!"
