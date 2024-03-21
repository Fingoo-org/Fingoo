import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import {
  updateSourceIndicatorRequestBody,
  CreateCustomForecastIndicatorRequestBody,
} from '../../store/querys/numerical-guidance/custom-forecast-indicator.query';
import { mockDB } from '../db';

export type customForecastIndicatorParam = {
  customForecastIndicatorId: string;
};

export const customForecastIndicatorHandlers = [
  http.get(API_PATH.customForecastIndicator, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getCustomForecastIndicatorList());
  }),
  http.post<never, CreateCustomForecastIndicatorRequestBody, never>(
    API_PATH.customForecastIndicator,
    async ({ request }) => {
      const newdata = await request.json();
      mockDB.postCustomForecastIndicator(newdata);
      await delayForDevelopment();
      return HttpResponse.json({
        status: 200,
      });
    },
  ),
  http.patch<customForecastIndicatorParam, updateSourceIndicatorRequestBody>(
    `${API_PATH.customForecastIndicator}/:customForecastIndicatorId`,
    async ({ params, request }) => {
      const { customForecastIndicatorId } = params;
      const data = await request.json();
      mockDB.patchSourceIndicator(customForecastIndicatorId, data);
      await delayForDevelopment();
      return HttpResponse.json({ status: 200 });
    },
  ),
];
