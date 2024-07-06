import dayjs from 'dayjs';
import { DateRange, Interval } from '../store/stores/numerical-guidance/indicator-board.store';

export function formatDate(date: string | dayjs.Dayjs) {
  return parseDate(date).format('YYYY-MM-DD');
}

export function addOneDay(date: string | dayjs.Dayjs) {
  return parseDate(date).add(1, 'day').format('YYYY-MM-DD');
}

export function parseDate(date: string | dayjs.Dayjs): dayjs.Dayjs {
  if (dayjs(date, 'YYYY-MM-DD', true).isValid()) {
    return dayjs(date);
  } else {
    return dayjs(date, 'YYYYMMDD');
  }
}

function getBiggestDate(date1: string, date2: string) {
  if (date1 === '') return date2;
  if (date2 === '') return date1;

  return parseDate(date1).isAfter(parseDate(date2)) ? date1 : date2;
}

function getSmallestDate(date1: string, date2: string) {
  if (date1 === '') return date2;
  if (date2 === '') return date1;

  return parseDate(date1).isBefore(parseDate(date2)) ? date1 : date2;
}

export function getBigestDateInArray(dates: string[]) {
  return formatDate(dates.reduce((acc, date) => getBiggestDate(acc, date), dates[0]));
}

export function getSmallestDateInArray(dates: string[]) {
  return formatDate(dates.reduce((acc, date) => getSmallestDate(acc, date), dates[0]));
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
export function getNowDate() {
  const now = dayjs();
  return now.format('YYYY-MM-DD');
}

export function calculateDateAfter(date: string, days: number) {
  return parseDate(date).add(days, 'day').format('YYYY-MM-DD');
}
