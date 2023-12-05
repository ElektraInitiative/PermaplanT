import useGetTimeLineEvents from '../../hooks/useGetTimelineEvents';
import { getShortMonthNameFromNumber } from '../../utils/date-utils';
import ItemSliderPicker from './ItemSliderPicker';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const TEST_IDS = Object.freeze({
  DAY_SLIDER: 'timeline__day-slider',
  MONTH_SLIDER: 'timeline__month-slider',
  YEAR_SLIDER: 'timeline__year-slider',
});

export type DayItem = {
  key: number;
  year: number;
  month: number;
  day: number;
  added: number;
  removed: number;
};

export type MonthItem = {
  key: number;
  year: number;
  month: number;
  added: number;
  removed: number;
};

export type YearItem = {
  key: number;
  year: number;
  added: number;
  removed: number;
};

type TimelineDatePickerProps = {
  /** Is called if the user selects a date from the timeline.
   * The date is passed as a string in the format 'YYYY-MM-DD'
   */
  onSelectDate: (date: string) => void;

  /** The default date to be selected on the timeline. */
  defaultDate: string;
};

const TimelineDatePicker = ({ onSelectDate, defaultDate }: TimelineDatePickerProps) => {
  const defaultYear = new Date(defaultDate).getFullYear();
  const defaultMonth = new Date(defaultDate).getMonth() + 1;
  const defaultDay = new Date(defaultDate).getDate();

  const {
    dailyTimeLineEvents: daySilderItems,
    monthlyTimeLineEvents: monthSliderItems,
    yearlyTimeLineEvents,
  } = useGetTimeLineEvents();
  const { i18n } = useTranslation();

  const [selectedYearItem, setSelectedYearItem] = useState<YearItem>(
    yearlyTimeLineEvents.find((yearSliderItem) => yearSliderItem.year === defaultYear) ||
      yearlyTimeLineEvents[0],
  );

  const [selectedMonthItem, setSelectedMonthItem] = useState<MonthItem>(
    monthSliderItems.find((month) => month.year === defaultYear && month.month === defaultMonth) ||
      monthSliderItems[0],
  );

  const [selectedDayItem, setSelectedDay] = useState<DayItem>(
    daySilderItems.find(
      (day) => day.year === defaultYear && day.month === defaultMonth && day.day === defaultDay,
    ) || daySilderItems[0],
  );

  const calculateVisibleDays = (dayItem: DayItem) => {
    return daySilderItems.filter(
      (day) => day.key >= dayItem.key - 100 && day.key <= dayItem.key + 100,
    );
  };

  const calculateVisibleMonths = (yearItem: YearItem) => {
    return monthSliderItems.filter(
      (month) => month.year >= yearItem.year - 3 && month.year <= yearItem.year + 3,
    );
  };

  const getLastDayItemOfMonth = (month: number, year: number) => {
    return daySilderItems
      .filter((daySliderItem) => daySliderItem.month === month && daySliderItem.year === year)
      .pop();
  };

  const [visibleDays, setVisibleDays] = useState<DayItem[]>(calculateVisibleDays(selectedDayItem));
  const [visibleMonths, setVisibleMonths] = useState<MonthItem[]>(
    calculateVisibleMonths(selectedYearItem),
  );

  const handleDayItemChange = (itemKey: number) => {
    const selectedDayItem = daySilderItems[itemKey];
    setSelectedDay(selectedDayItem);

    if (selectedDayItem.month !== selectedMonthItem.month) {
      const newMonthItem = monthSliderItems.find(
        (month) => selectedDayItem.month === month.month && selectedDayItem.year === month.year,
      );
      if (newMonthItem) {
        setSelectedMonthItem(newMonthItem);
      }
    }

    if (selectedDayItem.year !== selectedYearItem.year) {
      const newYearItem = yearlyTimeLineEvents.find(
        (yearSliderItem) => selectedDayItem.year === yearSliderItem.year,
      );
      if (newYearItem) {
        setSelectedYearItem(newYearItem);
      }
    }
  };

  const handleMonthChange = (key: number) => {
    const newMonthItem = monthSliderItems[key];
    setSelectedMonthItem(newMonthItem);

    if (newMonthItem.year !== selectedYearItem.year) {
      const newYearItem = yearlyTimeLineEvents.find(
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
    const newYearItem = yearlyTimeLineEvents[yearItemKey];
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

  const selectNewDayWhenMonthChanged = (newMonthItem: MonthItem) => {
    const sameDayInNewMonth = daySilderItems.find(
      (day) =>
        newMonthItem.month === day.month &&
        newMonthItem.year === day.year &&
        day.day === selectedDayItem.day,
    );

    const newDay =
      sameDayInNewMonth || getLastDayItemOfMonth(newMonthItem.month, newMonthItem.year);
    if (newDay) {
      setVisibleDays(calculateVisibleDays(newDay));
      setSelectedDay(newDay);
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
    if (visibleDays[visibleDays.length - 1].key < daySilderItems.length - 1) {
      setVisibleDays(calculateVisibleDays(selectedDayItem));
    }
  };

  function triggerDateChangedInGuidedTour(): void {
    const changeDateEvent = new Event('dateChanged');
    document.getElementById('timeline')?.dispatchEvent(changeDateEvent);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newDay = selectedDayItem;
      const formattedMonth = String(newDay.month).padStart(2, '0');
      const formattedDay = String(newDay.day).padStart(2, '0');
      const formattedDate = `${newDay.year}-${formattedMonth}-${formattedDay}`;
      onSelectDate(formattedDate);
      triggerDateChangedInGuidedTour();
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayItem]);

  return (
    <div data-tourid="timeline" id="timeline">
      <ItemSliderPicker
        dataTestId={TEST_IDS.YEAR_SLIDER}
        items={yearlyTimeLineEvents.map((yearSliderItem) => ({
          key: yearSliderItem.key,
          content: TimelineDatePickerItem({
            text: yearSliderItem.year.toString(),
            added: yearSliderItem.added,
            removed: yearSliderItem.removed,
          }),
        }))}
        onChange={handleYearChange}
        value={selectedYearItem.key}
      />
      <ItemSliderPicker
        dataTestId={TEST_IDS.MONTH_SLIDER}
        items={visibleMonths.map((monthSliderItem) => ({
          key: monthSliderItem.key,
          content: TimelineDatePickerItem({
            text: getShortMonthNameFromNumber(monthSliderItem.month, i18n.resolvedLanguage),
            added: monthSliderItem.added,
            removed: monthSliderItem.removed,
            disabled: monthSliderItem.year !== selectedYearItem.year,
          }),
        }))}
        onChange={handleMonthChange}
        leftEndReached={handleMontSliderLeftEndReached}
        rightEndReached={handleMontSliderRightEndReached}
        value={selectedMonthItem.key}
      />
      <ItemSliderPicker
        dataTestId={TEST_IDS.DAY_SLIDER}
        items={visibleDays.map((daySliderItem) => ({
          key: daySliderItem.key,
          content: TimelineDatePickerItem({
            text: daySliderItem.day.toString(),
            added: daySliderItem.added,
            removed: daySliderItem.removed,
            disabled:
              daySliderItem.month != selectedMonthItem.month ||
              daySliderItem.year != selectedMonthItem.year,
          }),
        }))}
        onChange={handleDayItemChange}
        leftEndReached={handleDaySliderLeftEndReached}
        rightEndReached={handleDaySliderRightEndReached}
        value={selectedDayItem.key}
      />
    </div>
  );
};

function TimelineDatePickerItem({
  text,
  added,
  removed,
  disabled,
}: {
  text: string;
  added: number;
  removed: number;
  disabled?: boolean;
}) {
  return (
    <div>
      <TimeLineDatePickerEventIndicator added={added} removed={removed} />
      <span className={`select-none ${disabled ? 'text-gray-400' : ''}`}>{text}</span>
    </div>
  );
}

function TimeLineDatePickerEventIndicator({ added, removed }: { added: number; removed: number }) {
  const greenBarHeight = added;
  const redBarHeight = removed;

  return (
    <div className="flex select-none justify-center">
      <div className="flex items-end">
        <div
          style={{ height: greenBarHeight + 'px' }}
          className="w-2 bg-primary-400 opacity-100"
        ></div>
      </div>
      <div className="flex items-end">
        <div
          style={{ height: redBarHeight + 'px' }}
          className="w-2 bg-red-400 opacity-100 dark:bg-red-700"
        ></div>
      </div>
    </div>
  );
}

export default TimelineDatePicker;
