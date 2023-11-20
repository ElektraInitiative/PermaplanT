import HorizontalScrollingPicker from './ItemSliderPicker';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, ReactNode, useState, useEffect } from 'react';

const createYears = () => {
  const years = [];
  let key = 0;
  for (let year = 1930; year <= 2030; year++) {
    const added = Math.floor(Math.random() * 21); // Random value between 0 and 100
    const removed = Math.floor(Math.random() * 21); // Random value between 0 and 100

    years.push({
      key: key++,
      date: year,
      added,
      removed,
    });
  }
  return years;
};

const createMonths = () => {
  const months = [];
  let key = 0;
  for (let year = 1930; year <= 2030; year++) {
    for (let month = 0; month < 12; month++) {
      const added = Math.floor(Math.random() * 21); // Random value between 0 and 100
      const removed = Math.floor(Math.random() * 21); // Random value between 0 and 100

      months.push({
        key: key++,
        year: year,
        month: month,
        added,
        removed,
      });
    }
  }
  return months;
};

const createDays = () => {
  const days = [];
  let key = 0;
  for (let year = 1930; year <= 2030; year++) {
    for (let month = 0; month < 12; month++) {
      for (let day = 0; day <= (month == 2 ? 28 : 30); day++) {
        const added = Math.floor(Math.random() * 21); // Random value between 0 and 100
        const removed = Math.floor(Math.random() * 21); // Random value between 0 and 100

        days.push({
          key: key++,
          year: year,
          month: month,
          day: day,
          added,
          removed,
        });
      }
    }
  }
  return days;
};

const getMonthName = (month: string) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  return monthNames[parseInt(month)];
};

const yearSliderItems = createYears();
const monthSliderItems = createMonths();
const daySliderItems = createDays();

type TimelineDatePickerProps = {
  /** Is called if the user selects a date from the timeline.
   * The date is passed as a string in the format 'YYYY-MM-DD'
   */
  onSelectDate: (date: string) => void;
  /** The default date to be selected on the timeline. */
  defaultDate: string;
};

const TimelineDatePicker = ({ onSelectDate, defaultDate }: TimelineDatePickerProps) => {
  console.log('rendering TimelineDatePicker');

  const [selectedYear, setSelectedYear] = useState<number>(
    yearSliderItems.findIndex((year) => year.date === parseInt(defaultDate.split('-')[0])),
  );

  const [selectedMonthItem, setSelectedMonthItem] = useState<number>(
    monthSliderItems.findIndex(
      (month) =>
        month.year === parseInt(defaultDate.split('-')[0]) &&
        month.month === parseInt(defaultDate.split('-')[1]) - 1,
    ),
  );

  const [selectedDayItem, setSelectedDay] = useState<number>(
    daySliderItems.findIndex(
      (day) =>
        day.year === parseInt(defaultDate.split('-')[0]) &&
        day.month === parseInt(defaultDate.split('-')[1]) - 1 &&
        day.day === parseInt(defaultDate.split('-')[2]) - 1,
    ),
  );

  const calculateVisibleDays = (selectedDay: number) => {
    return daySliderItems.filter(
      (day) =>
        day.key >= daySliderItems[selectedDay].key - 100 &&
        day.key <= daySliderItems[selectedDay].key + 100,
    );
  };

  const calculateVisibleMonths = (year: number) => {
    return monthSliderItems.filter(
      (month) =>
        month.year >= yearSliderItems[year].date - 3 &&
        month.year <= yearSliderItems[year].date + 3,
    );
  };

  const getLastDayItemOfMonth = (month: number, year: number) => {
    return daySliderItems.filter((day) => day.month === month && day.year === year).pop()?.key;
  };

  const updateSelectedDay = (newDayKey: number) => {
    setSelectedDay(newDayKey);
  };

  const [visibleDays, setVisibleDays] = useState<
    { key: number; year: number; month: number; day: number; added: number; removed: number }[]
  >(calculateVisibleDays(selectedDayItem));
  const [visibleMonths, setVisibleMonts] = useState<
    { key: number; year: number; month: number; added: number; removed: number }[]
  >(calculateVisibleMonths(selectedYear));

  const handleDayChange = (key: number) => {
    const newDay = daySliderItems[key];
    updateSelectedDay(key);
    if (newDay.month !== monthSliderItems[selectedMonthItem].month) {
      setSelectedMonthItem(
        monthSliderItems.findIndex(
          (month) => newDay.month === month.month && newDay.year === month.year,
        ),
      );
    }
    if (newDay.year !== selectedYear) {
      setSelectedYear(yearSliderItems.findIndex((year) => newDay.year === year.date));
    }
  };

  const handleMonthChange = (key: number) => {
    const newMonth = monthSliderItems[key];
    setSelectedMonthItem(key);

    if (newMonth.year !== selectedYear) {
      setSelectedYear(yearSliderItems.findIndex((year) => newMonth.year === year.date));
    }

    if (daySliderItems[selectedDayItem].month !== newMonth.month) {
      const newDay = daySliderItems.find(
        (day) =>
          newMonth.month === day.month &&
          newMonth.year === day.year &&
          day.day === daySliderItems[selectedDayItem].day,
      );
      const newDayKey = newDay?.key || getLastDayItemOfMonth(newMonth.month, newMonth.year) || 0;
      setVisibleDays(calculateVisibleDays(newDayKey));
      updateSelectedDay(newDayKey);
    }
  };

  const handleYearChange = (key: number) => {
    const newYear = yearSliderItems[key];
    setSelectedYear(key);

    if (monthSliderItems[selectedMonthItem].year !== newYear.date) {
      const newMonthKey =
        monthSliderItems.find(
          (month) =>
            newYear.date === month.year &&
            month.month === monthSliderItems[selectedMonthItem].month,
        )?.key || 0;

      setVisibleMonts(calculateVisibleMonths(key));
      setSelectedMonthItem(
        monthSliderItems.findIndex(
          (month) =>
            newYear.date === month.year &&
            month.month === monthSliderItems[selectedMonthItem].month,
        ),
      );

      const newMonth = monthSliderItems[newMonthKey];
      if (
        daySliderItems[selectedDayItem].month !== newMonth.month ||
        daySliderItems[selectedDayItem].year !== newMonth.year
      ) {
        const newDay = daySliderItems.find(
          (day) =>
            newMonth.month === day.month &&
            newMonth.year === day.year &&
            day.day === daySliderItems[selectedDayItem].day,
        );
        const newDayKey = newDay?.key || getLastDayItemOfMonth(newMonth.month, newMonth.year) || 0;
        setVisibleDays(calculateVisibleDays(newDayKey));
        updateSelectedDay(newDayKey);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const newDay = daySliderItems[selectedDayItem];
      onSelectDate(`${newDay.year}-${newDay.month + 1}-${newDay.day + 1}`);
    }, 500);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDayItem]);

  return (
    <>
      <HorizontalScrollingPicker
        items={yearSliderItems.map((year) => ({
          key: year.key,
          content: TimelineDatePickerItem({
            text: year.date.toString(),
            added: year.added,
            removed: year.removed,
          }),
        }))}
        onChange={handleYearChange}
        value={selectedYear}
      />
      <HorizontalScrollingPicker
        items={visibleMonths.map((month) => ({
          key: month.key,
          content: TimelineDatePickerItem({
            text: getMonthName(month.month.toString()),
            added: month.added,
            removed: month.removed,
            disabled: month.year !== yearSliderItems[selectedYear].date,
          }),
        }))}
        onChange={handleMonthChange}
        leftEndReached={() => {
          if (visibleMonths[0].key > 0) {
            setVisibleMonts(calculateVisibleMonths(selectedYear));
          }
        }}
        rightEndReached={() => {
          if (visibleMonths[visibleMonths.length - 1].key < monthSliderItems.length - 1) {
            setVisibleMonts(calculateVisibleMonths(selectedYear));
          }
        }}
        value={selectedMonthItem}
      />
      <HorizontalScrollingPicker
        items={visibleDays.map((day) => ({
          key: day.key,
          content: TimelineDatePickerItem({
            text: (day.day + 1).toString(),
            added: day.added,
            removed: day.removed,
            disabled: !(
              day.month == monthSliderItems[selectedMonthItem].month &&
              day.year == monthSliderItems[selectedMonthItem].year
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
          if (visibleDays[visibleDays.length - 1].key < daySliderItems.length - 1) {
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
      <span className="select-none" color={disabled ? 'gray' : 'black'}>
        {text}
      </span>
    </div>
  );
}

export default TimelineDatePicker;
