import { preload } from 'swr';
import { API_PATH } from './api-path';
import { defaultFetcher } from './fetcher';

export const workspacePagePreFetching = () => {
  preload(API_PATH.indicatorList, defaultFetcher);
};
