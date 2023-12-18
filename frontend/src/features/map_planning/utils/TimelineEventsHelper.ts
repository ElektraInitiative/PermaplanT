import useMapStore from '../store/MapStore';
import {
  TimelineYearlyEvent,
  TimelineMonthlyEvent,
  TimelineDailyEvent,
} from '../store/MapStoreTypes';
import { PlantingDto } from '@/api_types/definitions';

export default function updateTimlelineEventsForDate(
  loadedPlants: PlantingDto[],
  timelineDate: string,
) {
  const day = new Date(timelineDate).getDate();
  const month = new Date(timelineDate).getMonth() + 1;
  const year = new Date(timelineDate).getFullYear();

  const yearItems: TimelineYearlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.yearly),
  );
  const monthItems: TimelineMonthlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.monthly),
  );
  const dayItems: TimelineDailyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.daily),
  );

  const yearItem = yearItems.find((item) => item.year === year);
  const monthItem = monthItems.find((item) => item.year === year && item.month === month);
  const dayItem = dayItems.find(
    (item) => item.year === year && item.month === month && item.day === day,
  );

  console.log(loadedPlants);

  const addedPlants = loadedPlants.filter((plant) => {
    return plant.addDate === timelineDate;
  }).length;
  const removedPlants = loadedPlants.filter((plant) => {
    return plant.removeDate === timelineDate;
  }).length;

  if (!dayItem) return;

  const deltaAdded = addedPlants - dayItem.added;
  const deltaRemoved = removedPlants - dayItem.removed;

  if (yearItem) {
    yearItem.added += deltaAdded;
    yearItem.removed += deltaRemoved;
  }

  if (monthItem) {
    monthItem.added += deltaAdded;
    monthItem.removed += deltaRemoved;
  }

  console.log(yearItem, monthItem, dayItem);

  dayItem.added = addedPlants;
  dayItem.removed = removedPlants;

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: yearItems,
        monthly: monthItems,
        daily: dayItems,
      },
    },
  });
}

export function timlineEventsUpdateRemoveDate(oldRemoveDate?: string, newRemoveDate?: string) {
  if (oldRemoveDate) decreaseRemovedPlantsForDate(oldRemoveDate);
  if (newRemoveDate) increaseRemovedPlantsForDate(newRemoveDate);
}

export function timlineEventsUpdateAdedDate(oldAddedDate: string, newAddedDate: string) {
  decreaseAddedPlantsForDate(oldAddedDate);
  increaseAddedPlantsForDate(newAddedDate);
}

export function decreaseRemovedPlantsForDate(date: string) {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const yearItems: TimelineYearlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.yearly),
  );
  const monthItems: TimelineMonthlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.monthly),
  );
  const dayItems: TimelineDailyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.daily),
  );

  const yearItem = yearItems.find((item) => item.year === year);
  const monthItem = monthItems.find((item) => item.year === year && item.month === month);
  const dayItem = dayItems.find(
    (item) => item.year === year && item.month === month && item.day === day,
  );

  if (!dayItem) return;

  if (yearItem) {
    yearItem.removed -= 1;
  }

  if (monthItem) {
    monthItem.removed -= 1;
  }

  dayItem.removed -= 1;

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: yearItems,
        monthly: monthItems,
        daily: dayItems,
      },
    },
  });
}

export function increaseRemovedPlantsForDate(date: string) {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const yearItems: TimelineYearlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.yearly),
  );
  const monthItems: TimelineMonthlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.monthly),
  );
  const dayItems: TimelineDailyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.daily),
  );

  const yearItem = yearItems.find((item) => item.year === year);
  const monthItem = monthItems.find((item) => item.year === year && item.month === month);
  const dayItem = dayItems.find(
    (item) => item.year === year && item.month === month && item.day === day,
  );

  if (!dayItem) return;

  if (yearItem) {
    yearItem.removed += 1;
  }

  if (monthItem) {
    monthItem.removed += 1;
  }

  dayItem.removed += 1;

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: yearItems,
        monthly: monthItems,
        daily: dayItems,
      },
    },
  });
}

export function increaseAddedPlantsForDate(date: string) {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const yearItems: TimelineYearlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.yearly),
  );
  const monthItems: TimelineMonthlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.monthly),
  );
  const dayItems: TimelineDailyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.daily),
  );

  const yearItem = yearItems.find((item) => item.year === year);
  const monthItem = monthItems.find((item) => item.year === year && item.month === month);
  const dayItem = dayItems.find(
    (item) => item.year === year && item.month === month && item.day === day,
  );

  if (!dayItem) return;

  if (yearItem) {
    yearItem.added += 1;
  }

  if (monthItem) {
    monthItem.added += 1;
  }

  dayItem.added += 1;

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: yearItems,
        monthly: monthItems,
        daily: dayItems,
      },
    },
  });
}

export function decreaseAddedPlantsForDate(date: string) {
  const day = new Date(date).getDate();
  const month = new Date(date).getMonth() + 1;
  const year = new Date(date).getFullYear();

  const yearItems: TimelineYearlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.yearly),
  );
  const monthItems: TimelineMonthlyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.monthly),
  );
  const dayItems: TimelineDailyEvent[] = JSON.parse(
    JSON.stringify(useMapStore.getState().untrackedState.timeLineEvents.daily),
  );

  const yearItem = yearItems.find((item) => item.year === year);
  const monthItem = monthItems.find((item) => item.year === year && item.month === month);
  const dayItem = dayItems.find(
    (item) => item.year === year && item.month === month && item.day === day,
  );

  if (!dayItem) return;

  if (yearItem) {
    yearItem.added -= 1;
  }

  if (monthItem) {
    monthItem.added -= 1;
  }

  dayItem.added -= 1;

  useMapStore.setState({
    untrackedState: {
      ...useMapStore.getState().untrackedState,
      timeLineEvents: {
        yearly: yearItems,
        monthly: monthItems,
        daily: dayItems,
      },
    },
  });
}
