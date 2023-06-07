const { exec } = require('child_process');
const fs = require('fs');

// The IP address to ping
const target = '8.8.8.8';

// The number of pings to send for each run of MTR
const cycles = 1;

// The name of the file to write the output to
const outputFile = 'mtr_report.txt';

function runMtr() {
    exec(`mtr --report --report-cycles ${cycles} ${target}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        // Parse the output and check for packet loss
        const lines = stdout.split('\n');
        for (let line of lines) {
            const fields = line.split(/\s+/);
            const host = fields[2];
            const loss = parseFloat(fields[3]);
            console.log(host, loss)
            if (host !== '???' && loss > 10) {
                // Append the output to the file
                fs.appendFile(outputFile, stdout, (err) => {
                    if (err) throw err;
                    console.log('MTR output saved!');
                });
                break;
            }
        }

        // Start the next run of MTR
        runMtr();
    });
}

// Run MTR immediately
runMtr();
