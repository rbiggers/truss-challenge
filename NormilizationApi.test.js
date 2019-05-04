const normApi = require('./NormilizationApi');

describe('Time Tests', () => {
  test('Validate time string is a valid Date', () => {
    expect(() => {
      normApi.convertTimeToISO8601('Invalid Date');
    }).toThrow();
  });
  test('Validate time is in ISO-8601 standard', () => {
    expect(normApi.convertTimeToISO8601('05 October 2011 14:48 UTC')).toBe('2011-10-05T14:48:00.000Z');
    expect(normApi.convertTimeToISO8601('4/1/11 8:00:00 PM')).toBe('2011-04-02T00:00:00.000Z');
    expect(normApi.convertTimeToISO8601('4/1/11 11:00:00 AM')).toBe('2011-04-01T15:00:00.000Z');
  });
  test('Validate time is in US/Eastern timezone', () => {
    expect(normApi.convertToEasternTimeZone({ timeString: '4/1/11 8:08:00 PM', timeZone: 'America/New_York' })).toBe('4/1/2011, 11:08:00 PM');
  });
  test('Convert PDT to EST and return ISO-8601 standard', () => {
    const easterTime = normApi.convertToEasternTimeZone({ timeString: '4/1/11 8:21:00 PM', timeZone: 'America/New_York' });
    const isoTime = normApi.convertTimeToISO8601(easterTime);
    expect(isoTime).toBe('2011-04-02T03:21:00.000Z');
  });
  test('Validate time does not contain illegal character', () => {
    expect(() => {
      normApi.convertToEasternTimeZone({ timeString: '4/1/1�1 8:08:00 PM', timeZone: 'America/New_York' });
    }).toThrow();
    expect(() => {
      normApi.convertTimeToISO8601('4/1/11 11:�00:00 AM');
    }).toThrow();
  });
});

describe('Zip Code Tests', () => {
  test('Validate zip code only contains numbers', () => {
    expect(() => {
      normApi.formatZipcode('aA~!*&^%$#@({|/.<,`');
    }).toThrow();
  });
  test('Validate zip code does not exceed 5 digits', () => {
    expect(() => {
      normApi.formatZipcode('123456');
    }).toThrow();
  });
  test('Validate zip code does not contain invalid character', () => {
    expect(() => {
      normApi.formatZipcode('1�');
    }).toThrow();
  });
  test('Validate zip code is padded correctly', () => {
    expect(normApi.formatZipcode('')).toBe('00000');
    expect(normApi.formatZipcode('1')).toBe('00001');
    expect(normApi.formatZipcode('12')).toBe('00012');
    expect(normApi.formatZipcode('123')).toBe('00123');
    expect(normApi.formatZipcode('1234')).toBe('01234');
    expect(normApi.formatZipcode('12345')).toBe('12345');
  });
});

describe('Name Tests', () => {
  test('Validate name does not contain illegal character', () => {
    expect(() => {
      normApi.convertToUpperCase('russ bigg�ers');
    }).toThrow();
  });
  test('Validate name is converted to upper case', () => {
    expect(normApi.convertToUpperCase('russ')).toBe('RUSS');
    expect(normApi.convertToUpperCase('russ biggers')).toBe('RUSS BIGGERS');
    expect(normApi.convertToUpperCase('Russ Biggers')).toBe('RUSS BIGGERS');
    expect(normApi.convertToUpperCase('R√©sum√© Ron')).toBe('R√©SUM√© RON');
    expect(normApi.convertToUpperCase('Mary 1')).toBe('MARY 1');
    expect(normApi.convertToUpperCase('Ê†™Âºè‰ºöÁ§æ„Çπ„Çø„Ç∏„Ç™„Ç∏„Éñ„É™')).toBe('Ê†™ÂºÈ‰ºÖÁ§Æ„ÇΠ„ÇØ„Ç∏„Ç™„Ç∏„ÉÑ„É™');
  });
});

describe('Time Stamp Tests', () => {
  test('Validate string is a valid timestamp', () => {
    expect(() => {
      normApi.convertTimeStamp('Invalid time stamp');
    }).toThrow();
  });
  test('Validate time stamp does not contain illegal character', () => {
    expect(() => {
      normApi.convertTimeStamp('1:1:�1');
    }).toThrow();
  });
  test('Convert time stamp', () => {
    expect(normApi.convertTimeStamp('1:1:1')).toBe('3661.0');
    expect(normApi.convertTimeStamp('1:23:32.123')).toBe('5012.123');
    expect(normApi.convertTimeStamp('1:32:33.123')).toBe('5553.123');
    expect(normApi.convertTimeStamp('111:23:32.123')).toBe('401012.123');
    expect(normApi.convertTimeStamp('0:00:00.000')).toBe('0.0');
    expect(normApi.convertTimeStamp('0:00:00.1001')).toBe('1.1');
    expect(normApi.convertTimeStamp('0:00:00.3123')).toBe('3.123');
  });
});

describe('UTF-8 Tests', () => {
  test('Invalid unicode normalization form', () => {
    expect(() => {
      const options = { inputString: '\u0041\u030A', form: 'WRONG' };
      normApi.normalizeStringToUTF8(options);
    }).toThrow();
  });
  test('Validate strings are different', () => {
    expect('\u00E9').not.toBe('\u0065\u0301');
  });
  test('Validate normilization of string', () => {
    const norm1 = normApi.normalizeStringToUTF8({ inputString: '\u00E9' });
    const norm2 = normApi.normalizeStringToUTF8({ inputString: '\u0065\u0301' });
    expect(norm1).toBe(norm2);
    expect(norm1).toBe(norm2);
  });
});
