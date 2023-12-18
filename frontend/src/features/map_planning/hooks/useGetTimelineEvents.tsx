/**
 * This hook is currently just creating dummy data for the timeline until the backend is ready.
 */
import { useMemo } from 'react';

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function getDatesBetween(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

const createYears = () => {
  const years = [];
  let key = 0;
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    years.push({
      key: key++,
      year: year,
      removed: 0,
      added: 0,
    });
  }
  return years;
};

const createMonths = () => {
  const months = [];
  let key = 0;
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      months.push({
        key: key++,
        year: year,
        month: month,
        removed: 0,
        added: 0,
      });
    }
  }
  return months;
};

const createDays = () => {
  const dates = getDatesBetween(new Date(MIN_YEAR, 0, 1), new Date(MAX_YEAR, 11, 31));
  return dates.map((date, index) => {
    return {
      key: index,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      removed: 0,
      added: 0,
    };
  });
};

export default function useGetTimeLineEvents() {
  return useMemo(() => {
    return {
      daily: createDays(),
      monthly: createMonths(),
      yearly: createYears(),
    };
  }, []);
}
