import { type Fetcher } from 'swr';
import { instance } from '@/app/utils/http';

// Refactor: fetcher 정리 필요, 각 요청별로 나누기
export const defaultFetcher: Fetcher<any, string> = (url) => instance.get(url).then((res) => res.data);

export const postFetcher = async <RequestBody, Response = any>(
  key: string | string[],
  { arg }: { arg: RequestBody },
) => {
  const url = Array.isArray(key) ? key.join('/') : key;

  try {
    const response = await instance.post<Response>(url, arg);

    return response.data;
  } catch (e) {
    throw e;
  }
};

export const deleteFetcher = async (key: string | string[]) => {
  const url = Array.isArray(key) ? key.join('/') : key;
  try {
    await instance.delete(url);
  } catch (e) {
    throw e;
  }
};

export const fetchIndicatorsValue = async ([url, interval, ...ids]: string[]) => {
  const indicatorsvalue = await Promise.all(
    ids.map((id) =>
      instance
        .get(url, {
          params: {
            interval,
            indicatorId: id,
          },
        })
        .then((res) => res.data),
    ),
  );
  return { indicatorsValue: indicatorsvalue };
};

export const fetchCustomForecastIndicatorsValue = async ([url, ...ids]: string[]) => {
  const customForecastIndicatorsValue = await Promise.all(
    ids.map((id) =>
      instance
        .get(url, {
          params: {
            customForecastIndicatorId: id,
          },
        })
        .then((res) => res.data),
    ),
  );
  return customForecastIndicatorsValue;
};

export const patchFetcher = async <T>(key: string[], { arg }: { arg: T }) => {
  const url = key.join('/');
  try {
    await instance.patch(url, arg);
  } catch (e) {
    throw e;
  }
};
