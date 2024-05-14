import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import {
  updateSourceIndicatorRequestBody,
  CreateCustomForecastIndicatorRequestBody,
  UpdatecustomForecastIndicatorNameRequestBody,
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
  http.get<customForecastIndicatorParam>(
    `${API_PATH.customForecastIndicator}/value/:customForecastIndicatorId`,
    async ({ params }) => {
      const { customForecastIndicatorId } = params;
      const response = mockDB.getCustomForecastIndicatorValue(customForecastIndicatorId);
      await delayForDevelopment();
      if (!response) {
        return HttpResponse.json({ status: 404 });
      }
      return HttpResponse.json(response);
    },
  ),
  http.post<never, CreateCustomForecastIndicatorRequestBody, never>(
    API_PATH.customForecastIndicator,
    async ({ request }) => {
      const newdata = await request.json();
      await delayForDevelopment();

      const response = mockDB.postCustomForecastIndicator(newdata);
      return HttpResponse.text(response);
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
  http.patch<customForecastIndicatorParam, UpdatecustomForecastIndicatorNameRequestBody>(
    `${API_PATH.customForecastIndicator}/name/:customForecastIndicatorId`,
    async ({ params, request }) => {
      const { customForecastIndicatorId } = params;
      const { name } = await request.json();
      mockDB.updateCustomForecastIndicatorName(customForecastIndicatorId, name);
      await delayForDevelopment();
      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<customForecastIndicatorParam>(
    `${API_PATH.customForecastIndicator}/:customForecastIndicatorId`,
    async ({ params }) => {
      const { customForecastIndicatorId } = params;
      mockDB.deleteCustomForecastIndicator(customForecastIndicatorId);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
];
