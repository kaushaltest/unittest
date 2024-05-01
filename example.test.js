const { currentDate, formateDate } = require('./input');

describe('currentDate function', () => {
    test('should return a formatted date string', () => {
        const result = currentDate();
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });
});

describe('formateDate function', () => {
    test('should format a given date object into a string with UTC timezone, year, month, and day', () => {
        const date = new Date('2021-07-15T12:00:00');
        const result = formateDate(date);
     
        const expectedResult = '07/15/2021'; // Expected format: MM/DD/YYYY
        expect(result).toEqual(new Date(expectedResult));
    });

    test('should throw an error if input date is invalid', () => {
        const invalidDate = 'invalid';
        expect(() => {
            formateDate(invalidDate);
        }).toThrow('Invalid Date');
    });
});
