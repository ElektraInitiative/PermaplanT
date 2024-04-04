import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';

// https://docs.pmnd.rs/zustand/guides/testing
vi.mock('zustand');

expect.extend({
  /**
   * Like toEqual, but all numbers are rounded to precision digits.
   * Taken from: https://stackoverflow.com/questions/41060258/tobecloseto-equivalent-for-recursive-equality-test-in-jest
   */
  toEqualApproximately(received, expected, precision = 3) {
    function isNegativeZero(zero: number) {
      const isZero = zero === 0;
      const isNegative = 1 / zero === -Infinity;
      return isZero && isNegative;
    }

    function round(obj: object | number | unknown): unknown {
      if (typeof obj === 'object') {
        if ((obj as Array<unknown>).length) {
          return (obj as Array<unknown>).map(round);
        }

        return Object.keys(obj as object).reduce((acc, key) => {
          // @ts-expect-error We don't know how the tested objects look like.
          acc[key] = round(obj[key]);
          return acc;
        }, {});
      } else if (typeof obj === 'number') {
        const number = +(obj as number).toFixed(precision);
        return isNegativeZero(number) ? 0 : number;
      } else {
        return obj;
      }
    }

    expect(round(received)).toEqual(expected);

    return { pass: true, message: () => 'Objects are approximately equal' };
  },
});
