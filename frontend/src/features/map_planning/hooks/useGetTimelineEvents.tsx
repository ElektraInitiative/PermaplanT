const MIN_YEAR = 1930;
const MAX_YEAR = 2130;

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
  const days = [];
  let key = 0;
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 31; day++) {
        days.push({
          key: key++,
          year: year,
          month: month,
          day: day,
          removed: 0,
          added: 0,
        });
      }
    }
  }
  return days;
};

export default function useGetTimeLineEvents() {
  //TODO: useQuery to fetch timeline events from backend
  return {
    dailyTimeLineEvents: createDays(),
    monthlyTimeLineEvents: createMonths(),
    yearlyTimeLineEvents: createYears(),
  };
}
