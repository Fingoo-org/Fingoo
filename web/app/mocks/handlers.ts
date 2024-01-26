import { HttpResponse, http } from 'msw';
import { API_PATH } from '../api/api-path';

export const handlers = [
  // Intercept the "GET /resource" request.
  http.get(API_PATH.indicatorList, () => {
    // And respond with a "text/plain" response
    // with a "Hello world!" text response body.
    return HttpResponse.json({
      message: 'Hello world!',
    });
  }),
  http.get(API_PATH.metadataList, () => {
    return HttpResponse.json({
      metadataList: [
        {
          id: '1',
          name: 'metadata1',
          indicators: [],
        },
        {
          id: '2',
          name: 'metadata2',
          indicators: [],
        },
        {
          id: '3',
          name: 'metadata3',
          indicators: [],
        },
      ],
    });
  }),
  http.post(API_PATH.metadataList, () => {
    return HttpResponse.json({
      status: 200,
    });
  }),
];
