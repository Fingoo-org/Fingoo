import { http, HttpResponse } from 'msw';

export const scenarios = {
  success: [],
  error: [
    http.get('*', () => {
      return new HttpResponse(null, { status: 500 });
    }),
  ],
};
