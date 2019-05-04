const readline = require('readline');
const fs = require('fs');
const normApi = require('./NormilizationApi');

const writeStream = fs.createWriteStream('output.csv', { encoding: 'utf8' });

const rl = readline.createInterface({
  input: process.stdin,
  output: 'output.csv',
  terminal: false,
});

const csvArray = [];
let normalizedCSV = '';

function appendCSVLine(index, input, newline = false) {
  switch (index) {
    case 0: {
      normalizedCSV += `${input}${newline ? '\n' : ''}`;
      break;
    }

    case 1: {
      normalizedCSV += `,"${input}"${newline ? '\n' : ''}`;

      break;
    }
    default:
      normalizedCSV += `,${input}${newline ? '\n' : ''}`;
      break;
  }
}

function processLine(line) {
  let fooDuration;
  let barDuration;

  for (let index = 0; index < line.length; index++) {
    console.log('line');

    const lineData = line[index];

    switch (index) {
      case 0: {
        // Date
        try {
          const eastern = normApi.convertToEasternTimeZone({ timeString: lineData, timeZone: 'America/New_York' });
          appendCSVLine(index, normApi.convertTimeToISO8601(eastern));
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 1: {
        // Address
        try {
          normApi.validateUnicode(lineData);
          appendCSVLine(index, lineData);
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 2: {
        // Zip code
        try {
          appendCSVLine(index, normApi.formatZipcode(lineData));
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 3: {
        // Full name
        try {
          appendCSVLine(index, normApi.convertToUpperCase(lineData));
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 4: {
        // FooDuration
        try {
          fooDuration = normApi.convertTimeStamp(lineData);
          appendCSVLine(index, fooDuration);
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 5: {
        // BarDuration
        try {
          barDuration = normApi.convertTimeStamp(lineData);
          appendCSVLine(index, barDuration);
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 6: {
        // TotalDuration
        try {
          appendCSVLine(index, +fooDuration + +barDuration);
        } catch (error) {
          console.error(error);
        }
        break;
      }
      case 7: {
        // Notes
        try {
          appendCSVLine(index, lineData, true);
        } catch (error) {
          console.error(error);
        }
        break;
      }
      default:
        console.error('Something bad happened....');
        break;
    }
  }
}

function processFile() {
  for (let index = 0; index < csvArray.length; index++) {
    if (index === 0) {
      // Write header as is
      appendCSVLine(index, csvArray[index][0], true);
      continue;
    }
    processLine(csvArray[index][0]);
  }
  writeStream.write(normalizedCSV);
}

rl.on('line', (line) => {
  csvArray.push(normApi.parseCSVLine(line));
});

rl.on('close', () => {
  processFile();
});
