import { http, HttpResponse } from 'msw';

export const scenarios = {
  success: [],
  error: [
    http.post('*', () => {
      return new HttpResponse(null, { status: 500 });
    }),
  ],
};
