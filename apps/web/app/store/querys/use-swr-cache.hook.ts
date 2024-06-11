import { unstable_serialize, useSWRConfig } from 'swr';

export const useSWRCache = () => {
  const { cache } = useSWRConfig();

  const getSynchronizedData = (key: string | string[]) => {
    return cache.get(unstable_serialize(key))?.data;
  };

  const getPreviousCachedData = (key: string | string[]) => {
    const previousKey = key.slice(0, -1);
    return cache.get(unstable_serialize(previousKey))?.data;
  };

  return {
    getSynchronizedData,
    getPreviousCachedData,
  };
};
