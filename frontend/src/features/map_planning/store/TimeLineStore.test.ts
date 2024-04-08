import { useTimelineStore } from './TimeLineStore';

// mock the axios api configuration, so that we don't actually send requests to the backend
vi.mock('@/config/axios');

describe('TimeLineStore', () => {
  it('increased added events from store', () => {
    initializeTimeLineEvents();

    useTimelineStore.getState().increaseAddedEventsForDate('2022-01-01');
    const timeLineState = useTimelineStore.getState();

    // Check that the added events for 2022-01-01 have been increased
    expect(timeLineState.timeLineEvents.daily[0].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.daily[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.daily[0].added).toEqual(1);

    expect(timeLineState.timeLineEvents.monthly[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.monthly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.monthly[0].added).toEqual(1);

    expect(timeLineState.timeLineEvents.yearly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.yearly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.yearly[0].added).toEqual(1);

    // Check that the added events for 2023-01-01 have not been changed
    expect(timeLineState.timeLineEvents.daily[1].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.daily[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.daily[1].added).toEqual(10);

    expect(timeLineState.timeLineEvents.monthly[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.monthly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.monthly[1].added).toEqual(10);

    expect(timeLineState.timeLineEvents.yearly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.yearly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.yearly[1].added).toEqual(10);
  });

  it('increased removed events from store', () => {
    initializeTimeLineEvents();

    useTimelineStore.getState().increaseRemovedEventsForDate('2022-01-01');
    const timeLineState = useTimelineStore.getState();

    // Check that the added events for 2022-01-01 have been increased
    expect(timeLineState.timeLineEvents.daily[0].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.daily[0].removed).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].added).toEqual(0);

    expect(timeLineState.timeLineEvents.monthly[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.monthly[0].removed).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[0].added).toEqual(0);

    expect(timeLineState.timeLineEvents.yearly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.yearly[0].removed).toEqual(1);
    expect(timeLineState.timeLineEvents.yearly[0].added).toEqual(0);

    // Check that the added events for 2023-01-01 have not been changed
    expect(timeLineState.timeLineEvents.daily[1].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.daily[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.daily[1].added).toEqual(10);

    expect(timeLineState.timeLineEvents.monthly[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.monthly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.monthly[1].added).toEqual(10);

    expect(timeLineState.timeLineEvents.yearly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.yearly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.yearly[1].added).toEqual(10);
  });

  it('decrease added events from store', () => {
    initializeTimeLineEvents();

    useTimelineStore.getState().decreaseAddedEventsForDate('2023-01-01');
    const timeLineState = useTimelineStore.getState();

    // Check that the added events for 2023-01-01 have been decreased
    expect(timeLineState.timeLineEvents.daily[1].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.daily[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.daily[1].added).toEqual(9);

    expect(timeLineState.timeLineEvents.monthly[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.monthly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.monthly[1].added).toEqual(9);

    expect(timeLineState.timeLineEvents.yearly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.yearly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.yearly[1].added).toEqual(9);

    // Check that the added events for 2022-01-01 has not been changed
    expect(timeLineState.timeLineEvents.daily[0].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.daily[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.daily[0].added).toEqual(0);

    expect(timeLineState.timeLineEvents.monthly[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.monthly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.monthly[0].added).toEqual(0);

    expect(timeLineState.timeLineEvents.yearly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.yearly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.yearly[0].added).toEqual(0);
  });

  it('decrease removed events from store', () => {
    initializeTimeLineEvents();

    useTimelineStore.getState().decreaseRemovedEventsForDate('2023-01-01');
    const timeLineState = useTimelineStore.getState();

    // Check that the added events for 2023-01-01 have been decreased
    expect(timeLineState.timeLineEvents.daily[1].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.daily[1].removed).toEqual(9);
    expect(timeLineState.timeLineEvents.daily[1].added).toEqual(10);

    expect(timeLineState.timeLineEvents.monthly[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.monthly[1].removed).toEqual(9);
    expect(timeLineState.timeLineEvents.monthly[1].added).toEqual(10);

    expect(timeLineState.timeLineEvents.yearly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.yearly[1].removed).toEqual(9);
    expect(timeLineState.timeLineEvents.yearly[1].added).toEqual(10);

    // Check that the added events for 2022-01-01 has not been changed
    expect(timeLineState.timeLineEvents.daily[0].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.daily[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.daily[0].added).toEqual(0);

    expect(timeLineState.timeLineEvents.monthly[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.monthly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.monthly[0].added).toEqual(0);

    expect(timeLineState.timeLineEvents.yearly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.yearly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.yearly[0].added).toEqual(0);
  });

  it('update added date', () => {
    initializeTimeLineEvents();

    useTimelineStore.getState().timelineEventsUpdateAddedDate('2023-01-01', '2022-01-01');
    const timeLineState = useTimelineStore.getState();

    // Check that the added events for 2023-01-01 have been decreased
    expect(timeLineState.timeLineEvents.daily[1].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.daily[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.daily[1].added).toEqual(9);

    expect(timeLineState.timeLineEvents.monthly[1].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.monthly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.monthly[1].added).toEqual(9);

    expect(timeLineState.timeLineEvents.yearly[1].year).toEqual(2023);
    expect(timeLineState.timeLineEvents.yearly[1].removed).toEqual(10);
    expect(timeLineState.timeLineEvents.yearly[1].added).toEqual(9);

    // Check that the added events for 2022-01-01 have been increased
    expect(timeLineState.timeLineEvents.daily[0].day).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.daily[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.daily[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.daily[0].added).toEqual(1);

    expect(timeLineState.timeLineEvents.monthly[0].month).toEqual(1);
    expect(timeLineState.timeLineEvents.monthly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.monthly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.monthly[0].added).toEqual(1);

    expect(timeLineState.timeLineEvents.yearly[0].year).toEqual(2022);
    expect(timeLineState.timeLineEvents.yearly[0].removed).toEqual(0);
    expect(timeLineState.timeLineEvents.yearly[0].added).toEqual(1);
  });
});

it('update removed date', () => {
  initializeTimeLineEvents();

  useTimelineStore.getState().timelineEventsUpdateRemoveDate('2023-01-01', '2022-01-01');
  const timeLineState = useTimelineStore.getState();

  // Check that the added events for 2023-01-01 have been decreased
  expect(timeLineState.timeLineEvents.daily[1].day).toEqual(1);
  expect(timeLineState.timeLineEvents.daily[1].month).toEqual(1);
  expect(timeLineState.timeLineEvents.daily[1].year).toEqual(2023);
  expect(timeLineState.timeLineEvents.daily[1].removed).toEqual(9);
  expect(timeLineState.timeLineEvents.daily[1].added).toEqual(10);

  expect(timeLineState.timeLineEvents.monthly[1].month).toEqual(1);
  expect(timeLineState.timeLineEvents.monthly[1].year).toEqual(2023);
  expect(timeLineState.timeLineEvents.monthly[1].removed).toEqual(9);
  expect(timeLineState.timeLineEvents.monthly[1].added).toEqual(10);

  expect(timeLineState.timeLineEvents.yearly[1].year).toEqual(2023);
  expect(timeLineState.timeLineEvents.yearly[1].removed).toEqual(9);
  expect(timeLineState.timeLineEvents.yearly[1].added).toEqual(10);

  // Check that the added events for 2022-01-01 have been increased
  expect(timeLineState.timeLineEvents.daily[0].day).toEqual(1);
  expect(timeLineState.timeLineEvents.daily[0].month).toEqual(1);
  expect(timeLineState.timeLineEvents.daily[0].year).toEqual(2022);
  expect(timeLineState.timeLineEvents.daily[0].removed).toEqual(1);
  expect(timeLineState.timeLineEvents.daily[0].added).toEqual(0);

  expect(timeLineState.timeLineEvents.monthly[0].month).toEqual(1);
  expect(timeLineState.timeLineEvents.monthly[0].year).toEqual(2022);
  expect(timeLineState.timeLineEvents.monthly[0].removed).toEqual(1);
  expect(timeLineState.timeLineEvents.monthly[0].added).toEqual(0);

  expect(timeLineState.timeLineEvents.yearly[0].year).toEqual(2022);
  expect(timeLineState.timeLineEvents.yearly[0].removed).toEqual(1);
  expect(timeLineState.timeLineEvents.yearly[0].added).toEqual(0);
});

function initializeTimeLineEvents() {
  useTimelineStore.setState(
    (state) => ({
      ...state,
      timeLineEvents: {
        daily: [
          {
            key: 1,
            day: 1,
            month: 1,
            year: 2022,
            added: 0,
            removed: 0,
          },
          {
            key: 2,
            day: 1,
            month: 1,
            year: 2023,
            added: 10,
            removed: 10,
          },
        ],
        monthly: [
          {
            key: 11,
            month: 1,
            year: 2022,
            added: 0,
            removed: 0,
          },
          {
            key: 12,
            month: 1,
            year: 2023,
            added: 10,
            removed: 10,
          },
        ],
        yearly: [
          {
            key: 111,
            year: 2022,
            added: 0,
            removed: 0,
          },
          {
            key: 112,
            year: 2023,
            added: 10,
            removed: 10,
          },
        ],
      },
    }),
    false,
  );
}
