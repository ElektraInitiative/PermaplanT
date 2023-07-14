import { convertToDate } from './date-utils';

interface ObjectWithDates {
  add_date?: string;
  remove_date?: string;
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
    const addDate = o.add_date ? convertToDate(o.add_date) : undefined;
    const removeDate = o.remove_date ? convertToDate(o.remove_date) : undefined;

    if (isVisible(date, addDate, removeDate)) {
      return true;
    }

    return false;
  });
}

export function isVisible(date: Date, addDate?: Date, removeDate?: Date) {
  return (!addDate || addDate <= date) && (!removeDate || removeDate > date);
}
