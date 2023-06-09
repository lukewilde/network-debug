const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// Google's DNS
const target = "8.8.8.8";

// The number of pings to send for each run of MTR
const cycles = 20;

const logContainsPacketLoss = (logContents) => {
  // Parse the output and check for packet loss
  const lines = logContents.split("\n");
  for (let line of lines) {
    const fields = line.split(/\s+/);
    const host = fields[2];
    const loss = parseFloat(fields[3]);
    if (host !== "???" && loss > 10) {
      return true;
    }
  }
};

function runMtr() {
  // Get today's date and format it as YYYY-MM-DD
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  // Create the output file name for today
  const outputFile = path.join("logs", `${formattedDate}.txt`);

  exec(
    `mtr --report --report-cycles ${cycles} ${target}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }

      if (logContainsPacketLoss(stdout)) {
        // Append the output to the file
        fs.appendFile(outputFile, stdout, (err) => {
          if (err) throw err;
          process.stdout.write("\x07");
          process.stdout.write("🚨")
        });
      } else {
        process.stdout.write(".")
      }

      // Start the next run of MTR
      runMtr();
    }
  );
}

// Run MTR immediately
runMtr();
