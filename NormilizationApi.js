

const NormilizationApi = () => {
  const repChar = '�';

  // Private Methods

  /**
   *
   * @param {Object} options - The object supported by this method
   * @param {string} options.inputString - The string to insert the char flag
   * @param {integer} options.index - The index of the illegal character
   */
  const insertCharFlag = (options = { inputString: '', index: '0' }) => {
    const s = options.inputString;
    const i = options.index;

    const prefix = s.slice(0, i - 1);
    const postfix = s.slice(i + 1, s.length);
    const error = s.charAt(i);

    const result = [prefix, '-->', error, '<--', postfix].join('');

    return result;
  };

  /**
   * @param {string} - The string to be validated
   * @returns {boolean} - Returns true if all characters are valid'
   */
  const isValidChars = (input) => {
    try {
      const result = input.indexOf(repChar);

      if (result !== (-1)) {
        throw new Error(`Invalid character: ${insertCharFlag({ inputString: input, index: result })}`);
      }
      return true;
    } catch (error) {
      throw (error);
    }
  };

  // Public Methods

  /**
   *
   * @param {string} time
   */
  const convertTimeToISO8601 = (time) => {
    try {
      isValidChars(time);
      return new Date(time).toISOString();
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {Object} options - The options supported my this method
   * @param {string} options.timeString - The time date string to be converted
   * @param {string} options.locale - A string with a BCP 47 language tag
   * @param {string} options.timeZone - The time zone to use.
   */
  const convertToEasternTimeZone = (options = { timeString: '', locale: 'en-US', timeZone: 'America/Los_Angeles' }) => {
    try {
      isValidChars(options.timeString);

      // Per requirements assume timezone is in Pacific time
      const pacificTime = `${options.timeString} PDT`;

      const easternTime = new Date(pacificTime)
        .toLocaleString(options.locale, { timezone: options.timeZone });

      return easternTime;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {string} zipCode - The zip code to be formatted
   */
  const formatZipcode = (zipCode) => {
    const maxLength = 5;

    try {
      isValidChars(zipCode);

      if (zipCode.length > 5) {
        throw new Error('Invalid zip code, length too long');
      }
      if (!(zipCode.match(/^-?\d*\.?\d*$/))) {
        throw new Error('Invalid zip code, only numbers allowed');
      }
      return zipCode.padStart(maxLength, '0');
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {string} name - The name to be formatted
   */
  const convertToUpperCase = (name) => {
    try {
      isValidChars(name);

      return name.toUpperCase();
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {string} timeStamp - The time stamp to be converted.
   */
  const convertTimeStamp = (timeStamp) => {
    try {
      let parts;
      let minutes = 1;
      let seconds = 0;
      let milliseconds = 0;

      isValidChars(timeStamp);

      if (!(timeStamp.includes(':'))) {
        throw new Error('Invalid time stamp');
      }

      parts = timeStamp.split('.');

      if (timeStamp.includes('.')) {
        // Need to access index directly
        // eslint-disable-next-line prefer-destructuring
        milliseconds = parts[1];
        if (milliseconds >= 1000) {
          const temp = milliseconds / 1000;
          const tempParts = temp.toString().split('.');

          seconds += parseInt(tempParts[0], 10);
          // Need to access index directly
          // eslint-disable-next-line prefer-destructuring
          milliseconds = tempParts[1];
        }
      }

      parts = parts[0].split(':');

      while (parts.length > 0) {
        seconds += minutes * parseInt(parts.pop(), 10);
        minutes *= 60;
      }

      return `${seconds}.${milliseconds * 1}`;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {Object} options - The options supported my this method
   * @param {string} options.inputString - The the string to be normalized
   * @param {string} options.form - The unicode normilization form: NFC | NFD | NFKC | NFKD
   */
  const normalizeStringToUTF8 = (options = { inputString: '', form: 'NFC' }) => {
    try {
      return options.inputString.normalize(options.form);
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {*} input - The string to be printed
   */
  const printUTF8Characters = (input) => {
    try {
      const prefix = '\\u';
      let paddedCode = '';
      for (let index = 0; index < input.length; index++) {
        paddedCode += `${prefix}${input.charCodeAt(index)
          .toString(16)
          .padStart(4, 0)
          .toUpperCase()}`;
      }
      return paddedCode;
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
    *
    * @param {string} data The string to be validated
    */
  const validateUnicode = (data) => {
    try {
      isValidChars(data);
    } catch (error) {
      throw new Error(error);
    }
  };

  /**
   *
   * @param {string} strData - THe data to be parsed
   */
  const parseCSVLine = (strData) => {
    const arr = [];
    let quote = false; // true means we're inside a quoted field

    // iterate over each character, keep track of current row and column (of the returned array)
    for (let row = 0, col = 0, c = 0; c < strData.length; c++) {
      const cc = strData[c];
      const nc = strData[c + 1]; // current character, next character
      arr[row] = arr[row] || []; // create a new row if necessary
      arr[row][col] = arr[row][col] || ''; // create a new column (start with empty string) if necessary

      // If the current character is a quotation mark, and we're inside a
      // quoted field, and the next character is also a quotation mark,
      // add a quotation mark to the current column and skip the next character
      if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }

      // If it's just one quotation mark, begin/end quoted field
      if (cc === '"') { quote = !quote; continue; }

      // If it's a comma and we're not in a quoted field, move on to the next column
      if (cc === ',' && !quote) { ++col; continue; }

      // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
      // and move on to the next row and move to column 0 of that new row
      if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }

      // If it's a newline (LF or CR) and we're not in a quoted field,
      // move on to the next row and move to column 0 of that new row
      if (cc === '\n' && !quote) { ++row; col = 0; continue; }
      if (cc === '\r' && !quote) { ++row; col = 0; continue; }

      // Otherwise, append the current character to the current column
      arr[row][col] += cc;
    }
    return arr;
  };


  return {
    convertTimeToISO8601,
    convertToEasternTimeZone,
    formatZipcode,
    convertToUpperCase,
    convertTimeStamp,
    printUTF8Characters,
    normalizeStringToUTF8,
    validateUnicode,
    parseCSVLine,
  };
};

module.exports = NormilizationApi();
