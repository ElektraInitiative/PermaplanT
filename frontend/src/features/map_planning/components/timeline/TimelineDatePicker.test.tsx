import TimelineDatePicker from './TimelineDatePicker';
import { render } from '@testing-library/react';
import ReactTestUtils, { act } from 'react-dom/test-utils';

// ES6

describe('handleDayItemChange', () => {
  jest.useFakeTimers();
  it('should callback correct date when day item is changed', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2020-12-31" onSelectDate={onSelectChange} />,
    );
    act(() => {
      ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__day-slider'), {
        key: 'ArrowRight',
      });
    });
    jest.runAllTimers();
    expect(onSelectChange).toBeCalledWith('2021-01-01');
  });
});

describe('handleMonthItemChange', () => {
  jest.useFakeTimers();
  it('should callback correct date when month item is changed', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2020-12-01" onSelectDate={onSelectChange} />,
    );
    act(() => {
      ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__month-slider'), {
        key: 'ArrowLeft',
      });
    });

    jest.runAllTimers();
    expect(onSelectChange).toBeCalledWith('2020-11-01');
  });
});

describe('handleYearItemChange', () => {
  jest.useFakeTimers();
  it('should callback correct date when year item is changed', () => {
    Element.prototype.scrollTo = jest.fn();
    const onSelectChange = jest.fn();

    const timeline = render(
      <TimelineDatePicker defaultDate="2020-12-01" onSelectDate={onSelectChange} />,
    );
    act(() => {
      ReactTestUtils.Simulate.keyDown(timeline.getByTestId('timeline__year-slider'), {
        key: 'ArrowRight',
      });
    });

    jest.runAllTimers();
    expect(onSelectChange).toBeCalledWith('2021-12-01');
  });
});
