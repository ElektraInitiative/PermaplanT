import { getShortMonthNameFromNumber } from './date-utils';

describe('getShortMonthNameFromNumber', () => {
  it('should return correct german month names', () => {
    expect(getShortMonthNameFromNumber(1, 'de-DE')).toBe('Jan');
    expect(getShortMonthNameFromNumber(2, 'de-DE')).toBe('Feb');
    expect(getShortMonthNameFromNumber(3, 'de-DE')).toBe('Mär');
    expect(getShortMonthNameFromNumber(4, 'de-DE')).toBe('Apr');
    expect(getShortMonthNameFromNumber(5, 'de-DE')).toBe('Mai');
    expect(getShortMonthNameFromNumber(6, 'de-DE')).toBe('Jun');
    expect(getShortMonthNameFromNumber(7, 'de-DE')).toBe('Jul');
    expect(getShortMonthNameFromNumber(8, 'de-DE')).toBe('Aug');
    expect(getShortMonthNameFromNumber(9, 'de-DE')).toBe('Sep');
    expect(getShortMonthNameFromNumber(10, 'de-DE')).toBe('Okt');
    expect(getShortMonthNameFromNumber(11, 'de-DE')).toBe('Nov');
    expect(getShortMonthNameFromNumber(12, 'de-DE')).toBe('Dez');
  });

  it('should return correct english month names', () => {
    expect(getShortMonthNameFromNumber(1, 'en-US')).toBe('Jan');
    expect(getShortMonthNameFromNumber(2, 'en-US')).toBe('Feb');
    expect(getShortMonthNameFromNumber(3, 'en-US')).toBe('Mar');
    expect(getShortMonthNameFromNumber(4, 'en-US')).toBe('Apr');
    expect(getShortMonthNameFromNumber(5, 'en-US')).toBe('May');
    expect(getShortMonthNameFromNumber(6, 'en-US')).toBe('Jun');
    expect(getShortMonthNameFromNumber(7, 'en-US')).toBe('Jul');
    expect(getShortMonthNameFromNumber(8, 'en-US')).toBe('Aug');
    expect(getShortMonthNameFromNumber(9, 'en-US')).toBe('Sep');
    expect(getShortMonthNameFromNumber(10, 'en-US')).toBe('Oct');
    expect(getShortMonthNameFromNumber(11, 'en-US')).toBe('Nov');
    expect(getShortMonthNameFromNumber(12, 'en-US')).toBe('Dec');
  });
});
