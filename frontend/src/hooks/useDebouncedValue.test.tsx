import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import useDebouncedValue from './useDebouncedValue';

describe('useDebouncedValue', () => {
  const renderUseDebouncedValue = () => {
    const result = renderHook(() => {
      const [value, setValue] = useState('');
      const debouncedValue = useDebouncedValue(value, 500);

      return { value, setValue, debouncedValue };
    });

    return result;
  };

  afterEach(() => {
    vi.useRealTimers();
  });

  test('there should only be one timer running at a time', async () => {
    vi.useFakeTimers();

    const { result } = renderUseDebouncedValue();

    act(() => {
      result.current.setValue('t');
      vi.advanceTimersByTime(1);
    });

    act(() => {
      result.current.setValue('te');
      vi.advanceTimersByTime(1);
    });

    expect(vi.getTimerCount()).toBe(1);
  });

  test("it should return the value if it hasn't changed", async () => {
    const { result } = renderHook(() => useDebouncedValue('test', 500));

    expect(result.current).toBe('test');
  });

  test('it should return the value after the delay', async () => {
    vi.useFakeTimers();

    const { result } = renderUseDebouncedValue();

    act(() => {
      result.current.setValue('t');
      vi.advanceTimersByTime(1);
    });

    act(() => {
      result.current.setValue('te');
      vi.advanceTimersByTime(1);
    });

    act(() => {
      result.current.setValue('tes');
      vi.advanceTimersByTime(1);
    });

    act(() => {
      result.current.setValue('test');
      vi.advanceTimersByTime(1);
    });

    act(() => {
      vi.advanceTimersToNextTimer();
    });

    expect(result.current.debouncedValue).toBe('test');
  });
});
