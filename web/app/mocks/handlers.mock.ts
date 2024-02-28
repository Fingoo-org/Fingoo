import { HttpResponse, http, delay } from 'msw';
import { API_PATH } from '../store/querys/api-path';
import { mockDB } from './db.mock';
import {
  AddIndicatorToMetadataRequestBody,
  UpdateIndicatorBoardMetadataRequestBody,
} from '../store/querys/numerical-guidance/indicator-board-metadata.query';
import { CreateIndicatorMetadataRequestBody } from '../store/querys/numerical-guidance/indicator-board-metadata.query';
import { CreateCustomForecastIndicatorRequestBody } from '../store/querys/numerical-guidance/custom-forecast-indicator.query';

const delayForDevelopment = async (ms = 1000) => {
  if (process.env.NODE_ENV === 'development') {
    await delay(ms);
  }
};

const customForecastIndicatorHandlers = [
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
];

export const handlers = [
  http.get(API_PATH.indicatorBoardMetadata, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getMetadataList());
  }),
  http.post<never, CreateIndicatorMetadataRequestBody, never>(API_PATH.indicatorBoardMetadata, async ({ request }) => {
    const newMetadata = await request.json();
    mockDB.postMetadataList(newMetadata);
    await delayForDevelopment();
    return HttpResponse.json({
      status: 200,
    });
  }),
  http.get(API_PATH.indicatorList, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getIndicatorList());
  }),
  http.post<metadataParam, AddIndicatorToMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId`,
    async ({ params, request }) => {
      const { metadataId } = params;
      const indicator = await request.json();
      mockDB.postIndicatorToMetadata(metadataId, indicator);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<metadataParam & indicatorParam>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId/:indicatorKey`,
    async ({ params }) => {
      const { metadataId, indicatorKey } = params;
      mockDB.deleteIndicatorFromMetadata(metadataId, indicatorKey);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
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
  http.patch<metadataParam, UpdateIndicatorBoardMetadataRequestBody>(
    `${API_PATH.indicatorBoardMetadata}/:metadataId`,
    async ({ request, params }) => {
      const { metadataId } = params;
      const data = await request.json();
      await delayForDevelopment();
      mockDB.patchMetadata(metadataId, data);
      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<metadataParam>(`${API_PATH.indicatorBoardMetadata}/:metadataId`, async ({ params }) => {
    const { metadataId } = params;
    mockDB.deleteMetadata(metadataId);
    await delayForDevelopment();

    return HttpResponse.json({ status: 200 });
  }),
  ...customForecastIndicatorHandlers,
];

type metadataParam = {
  metadataId: string;
};

type indicatorParam = {
  indicatorKey: string;
};
