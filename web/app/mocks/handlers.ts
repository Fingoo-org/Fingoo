import { HttpResponse, http, delay } from 'msw';
import { API_PATH } from '../querys/api-path';
import { mockDB } from './mock-db';
import { AddIndicatorToMetadataRequestBody } from '../querys/numerical-guidance/indicator-board-metadata.query';
import { CreateIndicatorMetadataRequestBody } from '../querys/numerical-guidance/indicator-board-metadata.query';

export const handlers = [
  http.get(API_PATH.metadataList, async () => {
    return HttpResponse.json(mockDB.getMetadataList());
  }),
  http.post<never, CreateIndicatorMetadataRequestBody, never>(API_PATH.metadataList, async ({ request }) => {
    const newMetadata = await request.json();
    mockDB.postMetadataList(newMetadata);

    return HttpResponse.json({
      status: 200,
    });
  }),
  http.get(API_PATH.indicatorList, () => {
    return HttpResponse.json(mockDB.getIndicatorList());
  }),
  http.get<metadataParam>(`${API_PATH.metadata}/:metadataId`, ({ params }) => {
    const { metadataId } = params;

    const metadata = mockDB.getMetadata(metadataId);

    if (!metadata) {
      return HttpResponse.json(null, { status: 400 });
    }

    return HttpResponse.json(metadata);
  }),
  http.post<metadataParam, AddIndicatorToMetadataRequestBody>(
    `${API_PATH.metadata}/:metadataId`,
    async ({ params, request }) => {
      const { metadataId } = params;
      const indicator = await request.json();
      mockDB.postIndicatorToMetadata(metadataId, indicator);

      return HttpResponse.json({ status: 200 });
    },
  ),
  http.delete<metadataParam & indicatorParam>(`${API_PATH.metadata}/:metadataId/:indicatorKey`, ({ params }) => {
    const { metadataId, indicatorKey } = params;
    mockDB.deleteIndicatorFromMetadata(metadataId, indicatorKey);

    return HttpResponse.json({ status: 200 });
  }),
  http.get(API_PATH.indicatorValue, ({ request }) => {
    const url = new URL(request.url);
    const indicatorKey = url.searchParams.get('ticker');
    if (indicatorKey === null) {
      return HttpResponse.json(null, { status: 400 });
    }
    const indicatorValue = mockDB.getIndicatorValue(indicatorKey);
    // Risk: 해당하는 값이 없을 때는? 에러 아니면 빈 객체?
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
