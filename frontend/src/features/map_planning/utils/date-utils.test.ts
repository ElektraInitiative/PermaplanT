import { getShortMonthNameFromNumber } from './date-utils';

describe('getShortMonthNameFromNumber', () => {
  it('should return correct german month names', () => {
    expect(getShortMonthNameFromNumber(1, 'de-DE')).toBe('Jan');
  });
});
