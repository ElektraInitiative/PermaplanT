import { useMemo } from 'react';
import { TimelineEntryDto } from '@/api_types/definitions';
import { useGetTimelineEvents } from './mapEditorHookApi';

function getDatesBetween(startDate: Date, endDate: Date) {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

const createYearsAndMonths = (
  startYear: number,
  endYear: number,
  monthlyEvents: Record<string, TimelineEntryDto>,
  yearlyEvents: Record<string, TimelineEntryDto>,
) => {
  const years = [];
  const months = [];
  for (let year = startYear; year <= endYear; year++) {
    for (let month = 1; month <= 12; month++) {
      const events = monthlyEvents[`${year}-${month.toString().padStart(2, '0')}`];

      months.push({
        key: year * 100 + month,
        year: year,
        month: month,
        removed: events?.removals || 0,
        added: events?.additions || 0,
      });
    }

    const events = yearlyEvents[year];
    years.push({
      key: year,
      year: year,
      removed: events?.removals || 0,
      added: events?.additions || 0,
    });
  }
  return { years, months };
};

const createDays = (
  startYear: number,
  endYear: number,
  dailyEvents: Record<string, TimelineEntryDto>,
) => {
  const dates = getDatesBetween(new Date(startYear, 0, 1), new Date(endYear, 11, 31));
  return dates.map((date) => {
    const key = date.toISOString().split('T')[0];
    const events = dailyEvents[key];

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return {
      key: year * 10000 + month * 100 + day,
      year: year,
      month: month,
      day: day,
      removed: events?.removals || 0,
      added: events?.additions || 0,
    };
  });
};

export default function useGetTimeLineData(mapId: number, startYear: number, endYear: number) {
  const events = useGetTimelineEvents(mapId, `${startYear}-01-01`, `${endYear}-12-31`);
  return useMemo(() => {
    const { years, months } = createYearsAndMonths(
      startYear,
      endYear,
      events?.months || {},
      events?.years || {},
    );

    return {
      daily: createDays(startYear, endYear, events?.dates || {}),
      monthly: months,
      yearly: years,
    };
  }, [startYear, endYear, events?.dates, events?.months, events?.years]);
}
