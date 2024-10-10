import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import { mockDB } from '../db';

export const postHandlers = [
  http.get(`${API_PATH.postList}/list`, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getPosts());
  }),
];
