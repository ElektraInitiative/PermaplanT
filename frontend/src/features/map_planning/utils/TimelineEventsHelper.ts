import useMapStore from '../store/MapStore';

export function timlineEventsUpdateRemoveDate(oldRemoveDate?: string, newRemoveDate?: string) {
  if (oldRemoveDate) decreaseRemovedPlantsForDate(oldRemoveDate);
  if (newRemoveDate) increaseRemovedPlantsForDate(newRemoveDate);
}

export function timlineEventsUpdateAdedDate(oldAddedDate: string, newAddedDate: string) {
  decreaseAddedPlantsForDate(oldAddedDate);
  increaseAddedPlantsForDate(newAddedDate);
}

export function decreaseRemovedPlantsForDate(date: string) {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  const timelineEvents = useMapStore.getState().untrackedState.timeLineEvents;

  const updatedYearly = timelineEvents.yearly.map((yearItem) => {
    if (yearItem.year === year) {
      return { ...yearItem, removed: yearItem.removed - 1 };
    }
    return yearItem;
  });

  const updatedMonthly = timelineEvents.monthly.map((monthItem) => {
    if (monthItem.year === year && monthItem.month === month) {
      return { ...monthItem, removed: monthItem.removed - 1 };
    }
    return monthItem;
  });

  const updatedDaily = timelineEvents.daily.map((dayItem) => {
    if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
      return { ...dayItem, removed: dayItem.removed - 1 };
    }
    return dayItem;
  });

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: updatedYearly,
        monthly: updatedMonthly,
        daily: updatedDaily,
      },
    },
  });
}

export function increaseRemovedPlantsForDate(date: string) {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  const timelineEvents = useMapStore.getState().untrackedState.timeLineEvents;

  const updatedYearly = timelineEvents.yearly.map((yearItem) => {
    if (yearItem.year === year) {
      return { ...yearItem, removed: yearItem.removed + 1 };
    }
    return yearItem;
  });

  const updatedMonthly = timelineEvents.monthly.map((monthItem) => {
    if (monthItem.year === year && monthItem.month === month) {
      return { ...monthItem, removed: monthItem.removed + 1 };
    }
    return monthItem;
  });

  const updatedDaily = timelineEvents.daily.map((dayItem) => {
    if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
      return { ...dayItem, removed: dayItem.removed + 1 };
    }
    return dayItem;
  });

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: updatedYearly,
        monthly: updatedMonthly,
        daily: updatedDaily,
      },
    },
  });
}
export function increaseAddedPlantsForDate(date: string) {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  const timelineEvents = useMapStore.getState().untrackedState.timeLineEvents;

  const updatedYearly = timelineEvents.yearly.map((yearItem) => {
    if (yearItem.year === year) {
      return { ...yearItem, added: yearItem.added + 1 };
    }
    return yearItem;
  });

  const updatedMonthly = timelineEvents.monthly.map((monthItem) => {
    if (monthItem.year === year && monthItem.month === month) {
      return { ...monthItem, added: monthItem.added + 1 };
    }
    return monthItem;
  });

  const updatedDaily = timelineEvents.daily.map((dayItem) => {
    if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
      return { ...dayItem, added: dayItem.added + 1 };
    }
    return dayItem;
  });

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: updatedYearly,
        monthly: updatedMonthly,
        daily: updatedDaily,
      },
    },
  });
}

export function decreaseAddedPlantsForDate(date: string) {
  const parsedDate = new Date(date);
  const day = parsedDate.getDate();
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  const timelineEvents = useMapStore.getState().untrackedState.timeLineEvents;

  const updatedYearly = timelineEvents.yearly.map((yearItem) => {
    if (yearItem.year === year) {
      return { ...yearItem, added: yearItem.added - 1 };
    }
    return yearItem;
  });

  const updatedMonthly = timelineEvents.monthly.map((monthItem) => {
    if (monthItem.year === year && monthItem.month === month) {
      return { ...monthItem, added: monthItem.added - 1 };
    }
    return monthItem;
  });

  const updatedDaily = timelineEvents.daily.map((dayItem) => {
    if (dayItem.year === year && dayItem.month === month && dayItem.day === day) {
      return { ...dayItem, added: dayItem.added - 1 };
    }
    return dayItem;
  });

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: updatedYearly,
        monthly: updatedMonthly,
        daily: updatedDaily,
      },
    },
  });
}
