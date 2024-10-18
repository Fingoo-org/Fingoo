import { HttpResponse, http } from 'msw';
import { delayForDevelopment } from '.';
import { API_PATH } from '../../store/querys/api-path';
import { mockDB } from '../db';
import { PostsValueMockData } from '../mock-data/post-value.mock';
import { PostResponse, UpdatePostHeartRequestBody } from '@/app/store/querys/post/post-list.query';

type postParam = {
  postId: string;
};

export const postHandlers = [
  http.get(`${API_PATH.postList}`, async () => {
    await delayForDevelopment();
    return HttpResponse.json(mockDB.getPostList());
  }),
  http.patch<postParam, UpdatePostHeartRequestBody>(`${API_PATH.pathchHeart}/:postId`, async ({ request, params }) => {
    const postId = params.postId as string;
    const data = await request.json();
    await delayForDevelopment();
    mockDB.patchHeart(postId, data);
    return HttpResponse.json({ status: 200 });
  }),
];
