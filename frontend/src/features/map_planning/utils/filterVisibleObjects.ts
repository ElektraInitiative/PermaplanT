import { convertToDate } from './date-utils';

interface ObjectWithDates {
  addDate?: string;
  removeDate?: string;
}

/**
 * Filters out objects that are not visible on the map at the given date.
 */
export function filterVisibleObjects<T extends ObjectWithDates>(
  objects: Array<T>,
  dateStr: string,
) {
  const date = convertToDate(dateStr);

  return objects.filter((o) => {
    const addDate = o.addDate ? convertToDate(o.addDate) : undefined;
    const removeDate = o.removeDate ? convertToDate(o.removeDate) : undefined;

    if (isVisible(date, addDate, removeDate)) {
      return true;
    }

    return false;
  });
}

export function isVisible(date: Date, addDate?: Date, removeDate?: Date) {
  return (!addDate || addDate <= date) && (!removeDate || removeDate > date);
}
