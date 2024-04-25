import dayjs from 'dayjs';

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
