import { http } from 'msw';
import { API_PATH } from '@/app/store/querys/api-path';
// MC-19 포스트 리스트 구현
export const postListHandlers = [http.get(`${API_PATH.postList}`, async () => {})];
