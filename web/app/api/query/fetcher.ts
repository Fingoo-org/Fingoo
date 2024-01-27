import { type Fetcher } from 'swr';
import axios from 'axios';

export const defaultFetcher: Fetcher<any, string> = (url) => axios.get(url).then((res) => res.data);
