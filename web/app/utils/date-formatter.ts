import dayjs from 'dayjs';
import { DateRange, Interval } from '../store/stores/numerical-guidance/indicator-board.store';

export function formatDate(date: string | dayjs.Dayjs) {
  return parseDate(date).format('YYYY-MM-DD');
}

export function parseDate(date: string | dayjs.Dayjs): dayjs.Dayjs {
  if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(date);
  } else {
    return dayjs(date, 'YYYYMMDD');
  }
}

export function getStartDate(dateRange: DateRange, interval: Interval) {
  return calculateStartDate(dateRange, interval).format('YYYY-MM-DD');
}

function calculateStartDate(dateRange: DateRange, interval: Interval) {
  const now = dayjs();
  switch (dateRange) {
    case '1Y':
      return now.subtract(1, 'year');
    case '5Y':
      return now.subtract(5, 'year');
    case '10Y':
      return now.subtract(10, 'year');
    case 'MAX':
      return dayjs('1901-01-01');
    default:
      return calculateDefaultStartDate(interval);
  }
}

function calculateDefaultStartDate(interval: Interval) {
  const now = dayjs();
  switch (interval) {
    case 'day':
      return now.subtract(6, 'month');
    case 'week':
      return now.subtract(2, 'year');
    case 'month':
      return now.subtract(10, 'month');
    case 'year':
      return dayjs('1901-01-01');
  }
}
