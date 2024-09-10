import { API_PATH } from '@/app/store/querys/api-path';
import { http, HttpResponse } from 'msw';
import { mockDB } from '../db';
import { delayForDevelopment } from '.';

export const indicatorQuoteHandlers = [
  http.get(
    `${API_PATH.indicatorQuote}/:indicatorId&:symbol&:indicatorType&:volumeTimePeriod&:micCode&:eod&:interval&:timeZone`,
    async ({ request }) => {
      const url = new URL(request.url);
      const symbol = url.searchParams.get('symbol');
      if (symbol === null) return HttpResponse.json(null, { status: 400 });
      const response = mockDB.getIndicatorQuote(symbol);
      await delayForDevelopment();
      return HttpResponse.json(response);
    },
  ),
];
