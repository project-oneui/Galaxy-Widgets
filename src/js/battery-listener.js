const express = require('express');
const bodyParser = require('body-parser');
const os = require('os')
const fs = require('fs')
const path = require('path')
const folderPath = path.join(os.homedir(), 'AppData', 'Local', 'Samsung-Widgets', 'temp');

const app = express();
const portPhone = 23564;  // Port for phone data
const portTablet = 23565; // Port for tablet data

app.use(bodyParser.json());

// Route for saving phone JSON data
app.post('/save-json', (req, res) => {
    const jsonData = req.body;

    const jsonString = JSON.stringify(jsonData, null, 2);

    // Save JSON data to a file
    fs.writeFile(folderPath + "\\batteryPhoneInfo.json", jsonString, (err) => {
        if (err) {
            console.error('Error saving phone JSON data:', err);
            res.status(500).json({ error: 'Failed to save phone JSON data' });
        } else {
            console.log('Phone JSON data saved to file');
            res.json({ message: 'Phone JSON data saved successfully' });
        }
    });
});

// Route for saving tablet JSON data
app.post('/save-tablet-json', (req, res) => {
    const jsonData = req.body;

    const jsonString = JSON.stringify(jsonData, null, 2);
    // Save JSON data to a file
    fs.writeFile(folderPath + "\\batteryTabletInfo.json", jsonString, (err) => {
        if (err) {
            console.error('Error saving tablet JSON data:', err);
            res.status(500).json({ error: 'Failed to save tablet JSON data' });
        } else {
            console.log('Tablet JSON data saved to file');
            res.json({ message: 'Tablet JSON data saved successfully' });
        }
    });
});

// Listen on both ports
app.listen(portPhone, () => {
    console.log(`Server for phone data is running on port ${portPhone}`);
});

app.listen(portTablet, () => {
    console.log(`Server for tablet data is running on port ${portTablet}`);
});
