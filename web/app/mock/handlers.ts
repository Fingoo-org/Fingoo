import { HttpResponse, http } from 'msw';
import { API_PATH } from '../constants/api-path';

export const handlers = [
  // Intercept the "GET /resource" request.
  http.get(API_PATH.indicatorList, () => {
    // And respond with a "text/plain" response
    // with a "Hello world!" text response body.
    return HttpResponse.json({
      message: 'Hello world!',
    });
  }),
];
