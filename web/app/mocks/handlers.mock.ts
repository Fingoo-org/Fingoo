import { HttpResponse, http, delay } from 'msw';
import { API_PATH } from '../store/querys/api-path';
import { mockDB } from './db.mock';
import { AddIndicatorToMetadataRequestBody } from '../store/querys/numerical-guidance/indicator-board-metadata.query';
import { CreateIndicatorMetadataRequestBody } from '../store/querys/numerical-guidance/indicator-board-metadata.query';

const delayForDevelopment = async (ms = 1000) => {
  if (process.env.NODE_ENV === 'development') {
    await delay(ms);
  }
};

export const handlers = [
  http.get(API_PATH.metadataList, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getMetadataList());
  }),
  http.post<never, CreateIndicatorMetadataRequestBody, never>(API_PATH.metadataList, async ({ request }) => {
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
    `${API_PATH.metadataList}/:metadataId`,
    async ({ params, request }) => {
      const { metadataId } = params;
      const indicator = await request.json();
      mockDB.postIndicatorToMetadata(metadataId, indicator);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<metadataParam & indicatorParam>(
    `${API_PATH.metadataList}/:metadataId/:indicatorKey`,
    async ({ params }) => {
      const { metadataId, indicatorKey } = params;
      mockDB.deleteIndicatorFromMetadata(metadataId, indicatorKey);
      await delayForDevelopment();

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.get(API_PATH.indicatorValue, async ({ request }) => {
    const url = new URL(request.url);
    const indicatorKey = url.searchParams.get('ticker');
    if (indicatorKey === null) {
      return HttpResponse.json(null, { status: 400 });
    }
    const indicatorValue = mockDB.getIndicatorValue(indicatorKey);
    // Risk: 해당하는 값이 없을 때는? 에러 아니면 빈 객체?
    await delayForDevelopment();
    if (!indicatorValue) {
      return HttpResponse.json(null, { status: 400 });
    }
    return HttpResponse.json(indicatorValue);
  }),
];

type metadataParam = {
  metadataId: string;
};

type indicatorParam = {
  indicatorKey: string;
};
