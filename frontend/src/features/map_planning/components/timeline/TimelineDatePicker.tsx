import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import useMapStore from '../../store/MapStore';
import {
  TimelineDailyEvent,
  TimelineMonthlyEvent,
  TimelineYearlyEvent,
} from '../../store/MapStoreTypes';
import { getShortMonthNameFromNumber } from '../../utils/date-utils';
import ItemSliderPicker from './ItemSliderPicker';

export const TEST_IDS = Object.freeze({
  DAY_SLIDER: 'timeline__day-slider',
  MONTH_SLIDER: 'timeline__month-slider',
  YEAR_SLIDER: 'timeline__year-slider',
});

const DAY_SLIDER_VISIBLE_MONTHS = 3;

type TimelineDatePickerProps = {
  /** Is called when date is selected and process is completed.
   * The date is passed as a string in the format 'YYYY-MM-DD'
   */
  onSelectDate: (date: string) => void;

  /** Is called when date is selected and debouncing process is started */
  onLoading: () => void;

  /** The default date to be selected on the timeline. */
  defaultDate: string;
};

const TimelineDatePicker = ({ onSelectDate, onLoading, defaultDate }: TimelineDatePickerProps) => {
  const { i18n } = useTranslation();

  const daySliderItems = useMapStore((state) => state.untrackedState.timeLineEvents.daily);
  const monthSliderItems = useMapStore((state) => state.untrackedState.timeLineEvents.monthly);
  const yearSliderItems = useMapStore((state) => state.untrackedState.timeLineEvents.yearly);

  const defaulttDateObject = new Date(defaultDate);
  const defaultYear = defaulttDateObject.getFullYear();
  const defaultMonth = defaulttDateObject.getMonth() + 1;
  const defaultDay = defaulttDateObject.getDate();

  const defaultDayItem =
    daySliderItems.find(
      (day) => day.year === defaultYear && day.month === defaultMonth && day.day === defaultDay,
    ) || daySliderItems[0];
  const defaultMonthItem =
    monthSliderItems.find((month) => month.year === defaultYear && month.month === defaultMonth) ||
    monthSliderItems[0];
  const defaultYearItem =
    yearSliderItems.find((year) => year.year === defaultYear) || yearSliderItems[0];

  const submitTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [selectedYearItem, setSelectedYearItem] = useState<TimelineYearlyEvent>(defaultYearItem);
  const [selectedMonthItem, setSelectedMonthItem] =
    useState<TimelineMonthlyEvent>(defaultMonthItem);
  const [selectedDayItem, setSelectedDayItem] = useState<TimelineDailyEvent>(defaultDayItem);

  useEffect(() => {
    if (defaultDayItem) {
      setSelectedDayItem(defaultDayItem);
    }
  }, [defaultDayItem]);

  useEffect(() => {
    if (defaultMonthItem) {
      setSelectedMonthItem(defaultMonthItem);
    }
  }, [defaultMonthItem]);

  useEffect(() => {
    if (defaultYearItem) {
      setSelectedYearItem(defaultYearItem);
    }
  }, [defaultYearItem]);

  const calculateVisibleDays = useCallback(
    (dayItem: TimelineDailyEvent) => {
      if (dayItem === undefined) return [];

      const monthDifference = Math.floor(DAY_SLIDER_VISIBLE_MONTHS / 2);

      const yearStart = dayItem.month <= monthDifference ? dayItem.year - 1 : dayItem.year;
      const yearEnd = dayItem.month > 12 - monthDifference ? dayItem.year + 1 : dayItem.year;

      const monthStart =
        dayItem.month <= monthDifference
          ? dayItem.month + (12 - monthDifference)
          : dayItem.month - monthDifference;
      const monthEnd =
        dayItem.month > monthDifference
          ? dayItem.month - (12 - monthDifference)
          : dayItem.month + monthDifference;

      return daySliderItems.filter(
        (day) =>
          (day.year == yearStart && day.month >= monthStart) ||
          (day.year == yearEnd && day.month <= monthEnd),
      );
    },
    [daySliderItems],
  );

  const calculateVisibleMonths = useCallback(
    (yearItem: TimelineYearlyEvent) => {
      if (yearItem === undefined) return [];

      return monthSliderItems.filter(
        (month) => month.year >= yearItem.year - 3 && month.year <= yearItem.year + 3,
      );
    },
    [monthSliderItems],
  );

  const getLastDayItemOfMonth = (month: number, year: number) => {
    return daySliderItems
      .filter((daySliderItem) => daySliderItem.month === month && daySliderItem.year === year)
      .pop();
  };

  const [visibleDays, setVisibleDays] = useState<TimelineDailyEvent[]>(
    calculateVisibleDays(defaultDayItem),
  );
  const [visibleMonths, setVisibleMonths] = useState<TimelineMonthlyEvent[]>(
    calculateVisibleMonths(defaultYearItem),
  );

  const [focusedSlider, setFocusedSlider] = useState<'year' | 'month' | 'day'>();

  const updateSelectedDate = (selectedDayItem: TimelineDailyEvent) => {
    onLoading();
    setSelectedDayItem(selectedDayItem);
  };

  const handleDayItemChange = (itemKey: number) => {
    const selectedDayItem = daySliderItems.find((day) => day.key === itemKey);
    if (!selectedDayItem) return;

    updateSelectedDate(selectedDayItem);

    if (selectedDayItem.month !== selectedMonthItem.month) {
      const newMonthItem = monthSliderItems.find(
        (month) => selectedDayItem.month === month.month && selectedDayItem.year === month.year,
      );
      if (newMonthItem) {
        setSelectedMonthItem(newMonthItem);
      }
    }

    if (selectedDayItem.year !== selectedYearItem.year) {
      const newYearItem = yearSliderItems.find(
        (yearSliderItem) => selectedDayItem.year === yearSliderItem.year,
      );
      if (newYearItem) {
        setSelectedYearItem(newYearItem);
      }
    }
  };

  const handleMonthChange = (key: number) => {
    const newMonthItem = monthSliderItems.find((month) => month.key === key);
    if (!newMonthItem) return;

    setSelectedMonthItem(newMonthItem);

    if (newMonthItem.year !== selectedYearItem.year) {
      const newYearItem = yearSliderItems.find(
        (yearSliderItem) => newMonthItem.year === yearSliderItem.year,
      );
      if (newYearItem) {
        setSelectedYearItem(newYearItem);
      }
    }

    if (selectedDayItem.month !== newMonthItem.month) {
      selectNewDayWhenMonthChanged(newMonthItem);
    }
  };

  const handleYearChange = (yearItemKey: number) => {
    const newYearItem = yearSliderItems.find((year) => year.key === yearItemKey);
    if (!newYearItem) return;

    setSelectedYearItem(newYearItem);

    if (selectedMonthItem.year !== newYearItem.year) {
      const newMonthItem = monthSliderItems.find(
        (month) => newYearItem.year === month.year && month.month === selectedMonthItem.month,
      );

      if (newMonthItem) {
        setVisibleMonths(calculateVisibleMonths(newYearItem));
        setSelectedMonthItem(newMonthItem);

        if (
          selectedDayItem.month !== newMonthItem.month ||
          selectedDayItem.year !== newMonthItem.year
        ) {
          selectNewDayWhenMonthChanged(newMonthItem);
        }
      }
    }
  };

  const selectNewDayWhenMonthChanged = (newMonthItem: TimelineMonthlyEvent) => {
    const sameDayInNewMonth = daySliderItems.find(
      (day) =>
        newMonthItem.month === day.month &&
        newMonthItem.year === day.year &&
        day.day === selectedDayItem.day,
    );

    const newDay =
      sameDayInNewMonth || getLastDayItemOfMonth(newMonthItem.month, newMonthItem.year);
    if (newDay) {
      setVisibleDays(calculateVisibleDays(newDay));
      updateSelectedDate(newDay);
    }
  };

  const handleMontSliderLeftEndReached = () => {
    if (visibleMonths[0].key > 0) {
      setVisibleMonths(calculateVisibleMonths(selectedYearItem));
    }
  };

  const handleMontSliderRightEndReached = () => {
    if (visibleMonths[visibleMonths.length - 1].key < monthSliderItems.length - 1) {
      setVisibleMonths(calculateVisibleMonths(selectedYearItem));
    }
  };

  const handleDaySliderLeftEndReached = () => {
    if (visibleDays[0].key > 0) {
      setVisibleDays(calculateVisibleDays(selectedDayItem));
    }
  };

  const handleDaySliderRightEndReached = () => {
    if (visibleDays[visibleDays.length - 1].key < daySliderItems.length - 1) {
      setVisibleDays(calculateVisibleDays(selectedDayItem));
    }
  };

  const handleYearSliderLeftEndReached = () => {
    useMapStore.setState((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        timeLineVisibleYears: {
          from: state.untrackedState.timeLineVisibleYears.from - 100,
          to: state.untrackedState.timeLineVisibleYears.to - 100,
        },
      },
    }));
  };
  const handleYearSliderRightEndReached = () => {
    useMapStore.setState((state) => ({
      ...state,
      untrackedState: {
        ...state.untrackedState,
        timeLineVisibleYears: {
          from: state.untrackedState.timeLineVisibleYears.from + 100,
          to: state.untrackedState.timeLineVisibleYears.to + 100,
        },
      },
    }));
  };

  useEffect(() => {
    setVisibleDays(calculateVisibleDays(selectedDayItem));
  }, [calculateVisibleDays, selectedDayItem]);

  useEffect(() => {
    setVisibleMonths(calculateVisibleMonths(selectedYearItem));
  }, [calculateVisibleMonths, selectedYearItem]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setFocus('up');
        break;
      case 'ArrowDown':
        setFocus('down');
        break;
      default:
        break;
    }
  };

  const setFocus = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      switch (focusedSlider) {
        case 'year':
          setFocusedSlider('day');
          break;
        case 'month':
          setFocusedSlider('year');
          break;
        case 'day':
          setFocusedSlider('month');
          break;
        default:
          break;
      }
    } else if (direction === 'down') {
      switch (focusedSlider) {
        case 'year':
          setFocusedSlider('month');
          break;
        case 'month':
          setFocusedSlider('day');
          break;
        case 'day':
          setFocusedSlider('year');
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    submitTimeout.current = setTimeout(() => {
      const newDay = selectedDayItem;
      const formattedMonth = String(newDay.month).padStart(2, '0');
      const formattedDay = String(newDay.day).padStart(2, '0');
      const formattedDate = `${newDay.year}-${formattedMonth}-${formattedDay}`;
      onSelectDate(formattedDate);
    }, 1000);
    return () => clearTimeout(submitTimeout.current);
  }, [selectedDayItem, onSelectDate]);

  const maxAddedDay = Math.max(...daySliderItems.map((day) => day.added));
  const maxRemovedDay = Math.max(...daySliderItems.map((day) => day.removed));
  const maxAddedMonth = Math.max(...monthSliderItems.map((month) => month.added));
  const maxRemovedMonth = Math.max(...monthSliderItems.map((month) => month.removed));
  const maxAddedYear = Math.max(...yearSliderItems.map((year) => year.added));
  const maxRemovedYear = Math.max(...yearSliderItems.map((year) => year.removed));

  return (
    <div
      data-tourid="timeline"
      id="timeline"
      className="select-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {yearSliderItems.length > 0 && (
        <ItemSliderPicker
          dataTestId={TEST_IDS.YEAR_SLIDER}
          items={yearSliderItems.map((yearSliderItem) => ({
            key: yearSliderItem.key,
            content: TimelineDatePickerItem({
              text: yearSliderItem.year.toString(),
              added: yearSliderItem.added,
              removed: yearSliderItem.removed,
              maxAdded: maxAddedYear,
              maxRemoved: maxRemovedYear,
            }),
          }))}
          onChange={handleYearChange}
          onDragSelectionChanged={() => clearTimeout(submitTimeout.current)}
          value={selectedYearItem?.key || 0}
          autoFocus={focusedSlider === 'year'}
          onFocus={() => setFocusedSlider('year')}
          rightEndReached={handleYearSliderRightEndReached}
          leftEndReached={handleYearSliderLeftEndReached}
        />
      )}
      {monthSliderItems.length > 0 && (
        <ItemSliderPicker
          dataTestId={TEST_IDS.MONTH_SLIDER}
          items={visibleMonths.map((monthSliderItem) => ({
            key: monthSliderItem.key,
            content: TimelineDatePickerItem({
              text: getShortMonthNameFromNumber(monthSliderItem.month, i18n.resolvedLanguage),
              added: monthSliderItem.added,
              maxAdded: maxAddedMonth,
              maxRemoved: maxRemovedMonth,
              removed: monthSliderItem.removed,
              disabled: monthSliderItem.year !== selectedYearItem.year,
            }),
          }))}
          onChange={handleMonthChange}
          leftEndReached={handleMontSliderLeftEndReached}
          rightEndReached={handleMontSliderRightEndReached}
          value={selectedMonthItem?.key || 0}
          onDragSelectionChanged={() => clearTimeout(submitTimeout.current)}
          autoFocus={focusedSlider === 'month'}
          onFocus={() => setFocusedSlider('month')}
        />
      )}
      {daySliderItems.length > 0 && (
        <ItemSliderPicker
          dataTestId={TEST_IDS.DAY_SLIDER}
          items={visibleDays.map((daySliderItem) => ({
            key: daySliderItem.key,
            content: TimelineDatePickerItem({
              text: daySliderItem.day.toString(),
              added: daySliderItem.added,
              removed: daySliderItem.removed,
              maxAdded: maxAddedDay,
              maxRemoved: maxRemovedDay,
              disabled:
                daySliderItem.month != selectedMonthItem.month ||
                daySliderItem.year != selectedMonthItem.year,
            }),
          }))}
          onChange={handleDayItemChange}
          leftEndReached={handleDaySliderLeftEndReached}
          rightEndReached={handleDaySliderRightEndReached}
          value={selectedDayItem?.key || 0}
          onDragSelectionChanged={() => clearTimeout(submitTimeout.current)}
          autoFocus={focusedSlider === 'day'}
          onFocus={() => setFocusedSlider('day')}
        />
      )}
    </div>
  );
};

function TimelineDatePickerItem({
  text,
  added,
  removed,
  maxAdded,
  maxRemoved,
  disabled,
}: {
  text: string;
  added: number;
  removed: number;
  maxAdded: number;
  maxRemoved: number;
  disabled?: boolean;
}) {
  const maxHeight = Math.max(maxAdded, maxRemoved, 200);
  const addedHeight = added == 0 ? 0 : (Math.log(added) / Math.log(maxHeight)) * 40 + 2;
  const removedHeight = removed == 0 ? 0 : (Math.log(removed) / Math.log(maxHeight)) * 40 + 2;

  return (
    <div className="full-width flex w-9 select-none flex-col">
      <TimeLineDatePickerEventIndicator addedHeight={addedHeight} removedHeight={removedHeight} />
      <span className={`select-none	 text-center ${disabled ? 'text-gray-400' : ''}`}>{text}</span>
    </div>
  );
}

function TimeLineDatePickerEventIndicator({
  addedHeight,
  removedHeight,
}: {
  addedHeight: number;
  removedHeight: number;
}) {
  return (
    <div className="full-width select-none">
      <div
        style={{ width: addedHeight + 'px' }}
        className="h-[3px] bg-primary-400 opacity-100"
      ></div>
      <div
        style={{ width: removedHeight + 'px' }}
        className="mt-[1px] h-[3px] bg-red-400 opacity-100 dark:bg-red-700"
      ></div>
    </div>
  );
}

export default TimelineDatePicker;
