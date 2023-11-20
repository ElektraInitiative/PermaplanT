import useGetTimeLineEvents from '../../hooks/useGetTimelineEvents';
import HorizontalScrollingPicker from './ItemSliderPicker';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function getMonthName(monthNumber: number, language?: string) {
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString(language, { month: 'short' });
}

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

  const { dailyTimeLineEvents, monthlyTimeLineEvents, yearlyTimeLineEvents } =
    useGetTimeLineEvents();

  const { i18n } = useTranslation();

  const [selectedYear, setSelectedYear] = useState<number>(
    yearlyTimeLineEvents.findIndex((yearSliderItem) => yearSliderItem.year === defaultYear),
  );

  const [selectedMonthItem, setSelectedMonthItem] = useState<number>(
    monthlyTimeLineEvents.findIndex(
      (month) => month.year === defaultYear && month.month === defaultMonth,
    ),
  );

  const [selectedDayItem, setSelectedDay] = useState<number>(
    dailyTimeLineEvents.findIndex(
      (day) => day.year === defaultYear && day.month === defaultMonth && day.day === defaultDay,
    ),
  );

  const calculateVisibleDays = (selectedDay: number) => {
    return dailyTimeLineEvents.filter(
      (day) =>
        day.key >= dailyTimeLineEvents[selectedDay].key - 100 &&
        day.key <= dailyTimeLineEvents[selectedDay].key + 100,
    );
  };

  const calculateVisibleMonths = (yearItemKey: number) => {
    return monthlyTimeLineEvents.filter(
      (month) =>
        month.year >= yearlyTimeLineEvents[yearItemKey].year - 3 &&
        month.year <= yearlyTimeLineEvents[yearItemKey].year + 3,
    );
  };

  const getLastDayItemOfMonth = (month: number, year: number) => {
    return dailyTimeLineEvents.filter((day) => day.month === month && day.year === year).pop()?.key;
  };

  const [visibleDays, setVisibleDays] = useState<DayItem[]>(calculateVisibleDays(selectedDayItem));
  const [visibleMonths, setVisibleMonths] = useState<MonthItem[]>(
    calculateVisibleMonths(selectedYear),
  );

  const handleDayChange = (itemKey: number) => {
    const selectedDayItem = dailyTimeLineEvents[itemKey];
    setSelectedDay(itemKey);

    // update month if new day is in different month than previous selected day
    if (selectedDayItem.month !== monthlyTimeLineEvents[selectedMonthItem].month) {
      setSelectedMonthItem(
        monthlyTimeLineEvents.findIndex(
          (month) => selectedDayItem.month === month.month && selectedDayItem.year === month.year,
        ),
      );
    }

    // update year if new day is in different year than previous selected day
    if (selectedDayItem.year !== selectedYear) {
      setSelectedYear(
        yearlyTimeLineEvents.findIndex(
          (yearSliderItem) => selectedDayItem.year === yearSliderItem.year,
        ),
      );
    }
  };

  const handleMonthChange = (key: number) => {
    const newMonthItem = monthlyTimeLineEvents[key];
    setSelectedMonthItem(key);

    // update year if new month is in different year than previous selected month
    if (newMonthItem.year !== selectedYear) {
      setSelectedYear(
        yearlyTimeLineEvents.findIndex(
          (yearSliderItem) => newMonthItem.year === yearSliderItem.year,
        ),
      );
    }

    // update day if new month has changed
    if (dailyTimeLineEvents[selectedDayItem].month !== newMonthItem.month) {
      selectNewDayIfMonthChanged(newMonthItem);
    }
  };

  const handleYearChange = (yearItemKey: number) => {
    const newYearItem = yearlyTimeLineEvents[yearItemKey];
    setSelectedYear(yearItemKey);

    if (monthlyTimeLineEvents[selectedMonthItem].year !== newYearItem.year) {
      const newMonthItem = monthlyTimeLineEvents.find(
        (month) =>
          newYearItem.year === month.year &&
          month.month === monthlyTimeLineEvents[selectedMonthItem].month,
      );

      if (newMonthItem) {
        setVisibleMonths(calculateVisibleMonths(yearItemKey));
        setSelectedMonthItem(newMonthItem.key);

        if (
          dailyTimeLineEvents[selectedDayItem].month !== newMonthItem.month ||
          dailyTimeLineEvents[selectedDayItem].year !== newMonthItem.year
        ) {
          selectNewDayIfMonthChanged(newMonthItem);
        }
      }
    }
  };

  const selectNewDayIfMonthChanged = (newMonthItem: MonthItem) => {
    const newDay = dailyTimeLineEvents.find(
      (day) =>
        newMonthItem.month === day.month &&
        newMonthItem.year === day.year &&
        day.day === dailyTimeLineEvents[selectedDayItem].day,
    );

    const newDayKey =
      newDay?.key || getLastDayItemOfMonth(newMonthItem.month, newMonthItem.year) || 0;
    setVisibleDays(calculateVisibleDays(newDayKey));
    setSelectedDay(newDayKey);
  };

  //debounced submit
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newDay = dailyTimeLineEvents[selectedDayItem];
      onSelectDate(`${newDay.year}-${newDay.month}-${newDay.day}`);
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayItem]);

  return (
    <>
      <HorizontalScrollingPicker
        items={yearlyTimeLineEvents.map((yearSliderItem) => ({
          key: yearSliderItem.key,
          content: TimelineDatePickerItem({
            text: yearSliderItem.year.toString(),
            added: yearSliderItem.added,
            removed: yearSliderItem.removed,
          }),
        }))}
        onChange={handleYearChange}
        value={selectedYear}
      />
      <HorizontalScrollingPicker
        items={visibleMonths.map((monthSliderItem) => ({
          key: monthSliderItem.key,
          content: TimelineDatePickerItem({
            text: getMonthName(monthSliderItem.month, i18n.resolvedLanguage),
            added: monthSliderItem.added,
            removed: monthSliderItem.removed,
            disabled: monthSliderItem.year !== yearlyTimeLineEvents[selectedYear].year,
          }),
        }))}
        onChange={handleMonthChange}
        leftEndReached={() => {
          if (visibleMonths[0].key > 0) {
            setVisibleMonths(calculateVisibleMonths(selectedYear));
          }
        }}
        rightEndReached={() => {
          if (visibleMonths[visibleMonths.length - 1].key < monthlyTimeLineEvents.length - 1) {
            setVisibleMonths(calculateVisibleMonths(selectedYear));
          }
        }}
        value={selectedMonthItem}
      />
      <HorizontalScrollingPicker
        items={visibleDays.map((daySliderItem) => ({
          key: daySliderItem.key,
          content: TimelineDatePickerItem({
            text: daySliderItem.day.toString(),
            added: daySliderItem.added,
            removed: daySliderItem.removed,
            disabled: !(
              daySliderItem.month == monthlyTimeLineEvents[selectedMonthItem].month &&
              daySliderItem.year == monthlyTimeLineEvents[selectedMonthItem].year
            ),
          }),
        }))}
        onChange={handleDayChange}
        leftEndReached={() => {
          if (visibleDays[0].key > 0) {
            setVisibleDays(calculateVisibleDays(selectedDayItem));
          }
        }}
        rightEndReached={() => {
          if (visibleDays[visibleDays.length - 1].key < dailyTimeLineEvents.length - 1) {
            setVisibleDays(calculateVisibleDays(selectedDayItem));
          }
        }}
        value={selectedDayItem}
      />
    </>
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
  const greenBarHeight = added;
  const redBarHeight = removed;

  return (
    <div>
      <div className="flex select-none justify-center">
        <div className="flex items-end">
          <div
            style={{ height: greenBarHeight + 'px' }}
            className={
              disabled ? 'w-2 bg-primary-400 opacity-30' : 'w-2 bg-primary-400 opacity-100'
            }
          ></div>
        </div>
        <div className="flex items-end">
          <div
            style={{ height: redBarHeight + 'px' }}
            className={
              disabled
                ? 'w-2 bg-red-400 opacity-30 dark:bg-red-700'
                : 'w-2  bg-red-400 opacity-100 dark:bg-red-700'
            }
          ></div>
        </div>
      </div>
      <span className={`select-none ${disabled ? 'text-gray-400' : 'text-black'}`}>{text}</span>
    </div>
  );
}

export default TimelineDatePicker;
