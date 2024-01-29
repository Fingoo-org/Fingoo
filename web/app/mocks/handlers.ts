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
  http.get<getMetadataParam>(`${API_PATH.metadata}/:metadataId`, ({ params }) => {
    const { metadataId } = params;

    const metadata = mockDB.getMetadata(metadataId);

    if (!metadata) {
      return HttpResponse.json(null, { status: 400 });
    }

    return HttpResponse.json(metadata);
  }),
  http.post(`${API_PATH.metadataList}/:id`, ({ params }) => {
    const { id } = params;
    // const newMetadata = mockDB.putMetadata(id);

    // return HttpResponse.json(newMetadata);
  }),
];

type getMetadataParam = {
  metadataId: string;
};
