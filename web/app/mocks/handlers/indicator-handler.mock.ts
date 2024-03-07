import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import { mockDB } from '../db';

export const indicatorHandlers = [
  http.get(API_PATH.indicatorList, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getIndicatorList());
  }),
  http.get(API_PATH.historyIndicatorsValue, async ({ request }) => {
    const url = new URL(request.url);

    const indicatorId = url.searchParams.get('indicatorId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (indicatorId === null || startDate === null || endDate === null) {
      return HttpResponse.json(null, { status: 400 });
    }

    await delayForDevelopment();
    return HttpResponse.json(mockDB.getHistoryIndicatorValue(indicatorId, startDate, endDate));
  }),
  http.get(API_PATH.indicatorValue, async ({ request }) => {
    const url = new URL(request.url);
    const indicatorId = url.searchParams.get('indicatorId');
    if (indicatorId === null) {
      return HttpResponse.json(null, { status: 400 });
    }
    const indicatorValue = mockDB.getIndicatorValue(indicatorId);
    // Risk: 해당하는 값이 없을 때는? 에러 아니면 빈 객체?
    await delayForDevelopment();
    if (!indicatorValue) {
      return HttpResponse.json(null, { status: 400 });
    }
    return HttpResponse.json(indicatorValue);
  }),
];
