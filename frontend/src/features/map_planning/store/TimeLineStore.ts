import { create } from 'zustand';

export type TimelineDailyEvent = {
  key: number;
  year: number;
  month: number;
  day: number;
  added: number;
  removed: number;
};

export type TimelineMonthlyEvent = {
  key: number;
  year: number;
  month: number;
  added: number;
  removed: number;
};

export type TimelineYearlyEvent = {
  key: number;
  year: number;
  added: number;
  removed: number;
};

export type TimeLineEvents = {
  daily: TimelineDailyEvent[];
  monthly: TimelineMonthlyEvent[];
  yearly: TimelineYearlyEvent[];
};

interface TimelineState {
  timeLineEvents: TimeLineEvents;
  timeLineVisibleYears: {
    from: number;
    to: number;
  };
  decreaseRemovedEventsForDate: (date: string) => void;
  increaseRemovedEventsForDate: (date: string) => void;
  decreaseAddedEventsForDate: (date: string) => void;
  increaseAddedEventsForDate: (date: string) => void;
  timelineEventsUpdateRemoveDate: (oldRemoveDate?: string, newRemoveDate?: string) => void;
  timelineEventsUpdateAddedDate: (oldAddedDate: string, newAddedDate: string) => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => {
  return {
    timeLineEvents: {
      daily: [],
      monthly: [],
      yearly: [],
    },
    timeLineVisibleYears: {
      from: new Date().getFullYear() - 100,
      to: new Date().getFullYear() + 100,
    },
    decreaseAddedEventsForDate: (date: string) => {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();

      set((state) => ({
        timeLineEvents: {
          ...state.timeLineEvents,
          yearly: state.timeLineEvents.yearly.map((yearItem) => {
            if (yearItem.year === year) {
              return { ...yearItem, added: yearItem.added - 1 };
            }
            return yearItem;
          }),
          monthly: state.timeLineEvents.monthly.map((monthItem) => {
            if (monthItem.year === year && monthItem.month === month) {
              return { ...monthItem, added: monthItem.added - 1 };
            }
            return monthItem;
          }),
          daily: state.timeLineEvents.daily.map((dayItem) => {
            if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
              return { ...dayItem, added: dayItem.added - 1 };
            }
            return dayItem;
          }),
        },
      }));
    },
    increaseAddedEventsForDate: (date: string) => {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();

      set((state) => ({
        timeLineEvents: {
          ...state.timeLineEvents,
          yearly: state.timeLineEvents.yearly.map((yearItem) => {
            if (yearItem.year === year) {
              return { ...yearItem, added: yearItem.added + 1 };
            }
            return yearItem;
          }),
          monthly: state.timeLineEvents.monthly.map((monthItem) => {
            if (monthItem.year === year && monthItem.month === month) {
              return { ...monthItem, added: monthItem.added + 1 };
            }
            return monthItem;
          }),
          daily: state.timeLineEvents.daily.map((dayItem) => {
            if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
              return { ...dayItem, added: dayItem.added + 1 };
            }
            return dayItem;
          }),
        },
      }));
    },
    decreaseRemovedEventsForDate: (date: string) => {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();

      set((state) => ({
        timeLineEvents: {
          ...state.timeLineEvents,
          yearly: state.timeLineEvents.yearly.map((yearItem) => {
            if (yearItem.year === year) {
              return { ...yearItem, removed: yearItem.removed - 1 };
            }
            return yearItem;
          }),
          monthly: state.timeLineEvents.monthly.map((monthItem) => {
            if (monthItem.year === year && monthItem.month === month) {
              return { ...monthItem, removed: monthItem.removed - 1 };
            }
            return monthItem;
          }),
          daily: state.timeLineEvents.daily.map((dayItem) => {
            if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
              return { ...dayItem, removed: dayItem.removed - 1 };
            }
            return dayItem;
          }),
        },
      }));
    },
    increaseRemovedEventsForDate: (date: string) => {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate();
      const month = parsedDate.getMonth() + 1;
      const year = parsedDate.getFullYear();

      set((state) => ({
        timeLineEvents: {
          ...state.timeLineEvents,
          yearly: state.timeLineEvents.yearly.map((yearItem) => {
            if (yearItem.year === year) {
              return { ...yearItem, removed: yearItem.removed + 1 };
            }
            return yearItem;
          }),
          monthly: state.timeLineEvents.monthly.map((monthItem) => {
            if (monthItem.year === year && monthItem.month === month) {
              return { ...monthItem, removed: monthItem.removed + 1 };
            }
            return monthItem;
          }),
          daily: state.timeLineEvents.daily.map((dayItem) => {
            if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
              return { ...dayItem, removed: dayItem.removed + 1 };
            }
            return dayItem;
          }),
        },
      }));
    },
    timelineEventsUpdateAddedDate: (oldAddedDate: string, newAddedDate: string) => {
      get().decreaseAddedEventsForDate(oldAddedDate);
      get().increaseAddedEventsForDate(newAddedDate);
    },
    timelineEventsUpdateRemoveDate: (oldRemoveDate?: string, newRemoveDate?: string) => {
      if (oldRemoveDate) get().decreaseRemovedEventsForDate(oldRemoveDate);
      if (newRemoveDate) get().increaseRemovedEventsForDate(newRemoveDate);
    },
  };
});
