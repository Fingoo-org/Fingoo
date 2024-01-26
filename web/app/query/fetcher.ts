import { type Fetcher } from 'swr';

export const defaultFetcher: Fetcher<any, string> = (...args) => fetch(...args).then((res) => res.json());
