import { HttpResponse, http } from 'msw';
import { API_PATH } from '../api/api-path';
import { mockDB } from './mock-db';
import { CreateIndicatorMetadataRequestBody } from '../api/command/numerical-guidance.command';

export const handlers = [
  http.get(API_PATH.metadataList, () => {
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
];
