const { exec } = require('child_process');
const fs = require('fs');

// The IP address to ping
const target = '8.8.8.8';

// The number of pings to send for each run of MTR
const cycles = 10;

// The name of the file to write the output to
const outputFile = 'mtr_report.txt';

function runMtr() {
    exec(`mtr --report --report-cycles ${cycles} ${target}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        // Append the output to the file
        fs.appendFile(outputFile, stdout, (err) => {
            if (err) throw err;
            console.log('MTR output saved!');

            // Start the next run of MTR
            runMtr();
        });
    });
}

// Run MTR immediately
runMtr();
