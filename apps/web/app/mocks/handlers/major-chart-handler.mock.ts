import { HttpResponse, http } from 'msw';
import { API_PATH } from '@/app/store/querys/api-path';
import { mockDB } from '../db';
import { MajorChartResponse } from '@/app/store/querys/mobile/major-chart.query';
import { delayForDevelopment } from '.';

export type MajorChartParam = {
  country: string;
};
export const majorChartHandlers = [
  http.get<MajorChartParam>(`${API_PATH.majorChart}/:country`, async ({ params }) => {
    const { country } = params;
    const response = mockDB.getMajorChart(country);
    await delayForDevelopment();
    return HttpResponse.json(response);
  }),
];
