import { isVisible } from './filterVisibleObjects';

describe('isVisible', () => {
  it('should return true if `addDate` and `removeDate` are undefined', () => {
    const date = new Date();
    const addDate = undefined;
    const removeDate = undefined;

    expect(isVisible(date, addDate, removeDate)).toBe(true);
  });

  it('should return true if `addDate` is before or equal to `date` and `removeDate` is undefined', () => {
    const date = new Date();
    let addDate = new Date(date.getTime());
    const removeDate = undefined;

    expect(isVisible(date, addDate, removeDate)).toBe(true);

    addDate = new Date(date.getTime() - 1000);

    expect(isVisible(date, addDate, removeDate)).toBe(true);
  });

  it('should return true if `addDate` is before or equal to `date` and `removeDate` is after `date`', () => {
    const date = new Date();
    let addDate = new Date(date.getTime());
    const removeDate = new Date(date.getTime() + 1000);

    expect(isVisible(date, addDate, removeDate)).toBe(true);

    addDate = new Date(date.getTime() - 1000);

    expect(isVisible(date, addDate, removeDate)).toBe(true);
  });

  it('should return true if `addDate` is undefined and `removeDate` is after `date`', () => {
    const date = new Date();
    const addDate = undefined;
    const removeDate = new Date(date.getTime() + 1000);

    expect(isVisible(date, addDate, removeDate)).toBe(true);
  });

  it('should return false if `addDate` is after `date`', () => {
    const date = new Date();
    const addDate = new Date(date.getTime() + 1000);

    expect(isVisible(date, addDate, undefined)).toBe(false);
    expect(isVisible(date, addDate, new Date(date.getTime() + 1000))).toBe(false);
    expect(isVisible(date, addDate, new Date(date.getTime() - 1000))).toBe(false);
  });

  it('should return false if `removeDate` is before or equal to `date`', () => {
    const date = new Date();
    const addDate = undefined;
    let removeDate = new Date(date.getTime());

    expect(isVisible(date, addDate, removeDate)).toBe(false);

    removeDate = new Date(date.getTime() - 1000);

    expect(isVisible(date, addDate, removeDate)).toBe(false);
  });

  it('should return false if `addDate` and `removeDate` are before `date`', () => {
    const date = new Date();
    const addDate = new Date(date.getTime() - 2000);
    const removeDate = new Date(date.getTime() - 1000);

    expect(isVisible(date, addDate, removeDate)).toBe(false);
  });

  it('should return false if `addDate` and `removeDate` are after `date`', () => {
    const date = new Date();
    const addDate = new Date(date.getTime() + 1000);
    const removeDate = new Date(date.getTime() + 2000);

    expect(isVisible(date, addDate, removeDate)).toBe(false);
  });
});
