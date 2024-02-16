/**
 * This hook is currently just creating dummy data for the timeline until the backend is ready.
 */
import { useMemo } from 'react';
import { TimelineEntryDto } from '@/api_types/definitions';
import { useGetTimelineEvents } from './mapEditorHookApi';

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

const createYears = (yearlyEvents: Record<string, TimelineEntryDto>) => {
  const years = [];
  let key = 0;
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    const events = yearlyEvents[year];

    years.push({
      key: key++,
      year: year,
      removed: events?.removals || 0,
      added: events?.additions || 0,
    });
  }
  return years;
};

const createMonths = (monthlyEvents: Record<string, TimelineEntryDto>) => {
  const months = [];
  let key = 0;
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      const events = monthlyEvents[`${year}-${month.toString().padStart(2, '0')}`];

      months.push({
        key: key++,
        year: year,
        month: month,
        removed: events?.removals || 0,
        added: events?.additions || 0,
      });
    }
  }
  return months;
};

const createDays = (dailyEvents: Record<string, TimelineEntryDto>) => {
  const dates = getDatesBetween(new Date(MIN_YEAR, 0, 1), new Date(MAX_YEAR, 11, 31));
  return dates.map((date, index) => {
    const key = date.toISOString().split('T')[0];
    const events = dailyEvents[key];

    return {
      key: index,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      removed: events?.removals || 0,
      added: events?.additions || 0,
    };
  });
};

export default function useGetTimeLineData(mapId: number) {
  const events = useGetTimelineEvents(mapId);
  console.log('events', events?.dates);

  return useMemo(() => {
    return {
      daily: createDays(events?.dates || {}),
      monthly: createMonths(events?.months || {}),
      yearly: createYears(events?.years || {}),
    };
  }, [events?.dates, events?.months, events?.years]);
}
