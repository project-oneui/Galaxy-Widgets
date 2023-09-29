# Define paths to candle.exe, light.exe, and Heat.exe
$candlePath = "C:\Program Files (x86)\WiX Toolset v3.11\bin\candle.exe"
$lightPath = "C:\Program Files (x86)\WiX Toolset v3.11\bin\light.exe"
$heatPath = "C:\Program Files (x86)\WiX Toolset v3.11\bin\heat.exe"

# Set the source directory
$sourceDir = "D:\a\oneui-desktop-widgets\samsung-widgets\samsung-widgets-win32-x64"

# Compile the main WiX source file into .wixobj files
& $candlePath "-o" "build/windows/" "samsung-widgets.wxs" "-dSourceDir=$sourceDir"

# Harvest files from the specified directory using Heat and generate a WiX source file
& $heatPath "dir" "$sourceDir" -dr INSTALLFOLDER -cg MyComponentGroup -gg -srd -sfrag -out "GeneratedFile.wxs"

# Link the .wixobj files and generated .wxs file into an MSI installer
& $lightPath "build\windows\*.wixobj", "GeneratedFile.wxs" "-o" "bin\samsung-widgets.msi"

Write-Output "MSI Installer Created!"