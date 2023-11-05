import HorizontalScrollingPicker from './HorizontalScrollingPicker';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useRef, ReactNode } from 'react';

const createYears = () => {
  const years = [];
  for (let year = 1930; year <= 2030; year++) {
    const added = Math.floor(Math.random() * 21); // Random value between 0 and 100
    const removed = Math.floor(Math.random() * 21); // Random value between 0 and 100

    years.push({
      date: year.toString(),
      added,
      removed,
    });
  }
  return years;
};

const createMonths = () => {
  const months = [];
  for (let year = 1930; year <= 1932; year++) {
    for (let month = 1; month <= 12; month++) {
      const added = Math.floor(Math.random() * 21); // Random value between 0 and 100
      const removed = Math.floor(Math.random() * 21); // Random value between 0 and 100

      months.push({
        year: year.toString(),
        month: month.toString(),
        added,
        removed,
      });
    }
  }
  return months;
};

const createDays = () => {
  const days = [];
  for (let year = 1930; year <= 1930; year++) {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 31; day++) {
        const added = Math.floor(Math.random() * 21); // Random value between 0 and 100
        const removed = Math.floor(Math.random() * 21); // Random value between 0 and 100

        days.push({
          year: year.toString(),
          month: month.toString(),
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
  return monthNames[parseInt(month) - 1];
};

const TimelineDatePicker = () => {
  const selectedDay = useRef<number>(20);
  const years = createYears();
  const months = createMonths();
  const days = createDays();

  return (
    <>
      <HorizontalScrollingPicker
        items={years.map((year) =>
          TimelineDatePickerItem({ text: year.date, added: year.added, removed: year.removed }),
        )}
        onChange={(idx) => {
          console.log('changed year: ', years[idx]);
        }}
      />
      <HorizontalScrollingPicker
        items={months.map((month) =>
          TimelineDatePickerItem({
            text: getMonthName(month.month),
            added: month.added,
            removed: month.removed,
          }),
        )}
        onChange={(idx) => {
          console.log('changed month: ', months[idx]);
        }}
      />
      <HorizontalScrollingPicker
        items={days.map((day) =>
          TimelineDatePickerItem({
            text: day.day.toString(),
            added: day.added,
            removed: day.removed,
          }),
        )}
        onChange={(idx) => {
          console.log('changed day: ', days[idx]);
          selectedDay.current = idx;
        }}
      />
    </>
  );
};

function TimelineDatePickerItem({
  text,
  added,
  removed,
}: {
  text: string;
  added: number;
  removed: number;
}) {
  const greenBarHeight = added;
  const redBarHeight = removed;

  return (
    <>
      <div className="flex">
        <div className="flex items-end">
          <div
            style={{ backgroundColor: 'green', height: greenBarHeight + 'px' }}
            className="w-2	opacity-40"
          ></div>
        </div>
        <div className="flex items-end">
          <div
            style={{ backgroundColor: 'red', height: redBarHeight + 'px' }}
            className="w-2	opacity-40"
          ></div>
        </div>
      </div>
      <span>{text}</span>
    </>
  );
}

export default TimelineDatePicker;
