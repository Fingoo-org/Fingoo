import { unstable_serialize, useSWRConfig } from 'swr';

export const useSWRCache = () => {
  const { cache } = useSWRConfig();

  const getSynchronizedData = <T>(key: string | string[]) => {
    return cache.get(unstable_serialize(key))?.data as T | undefined;
  };

  const getPreviousCachedData = <T>(key: string | string[]) => {
    const previousKey = key.slice(0, -1);
    return cache.get(unstable_serialize(previousKey))?.data as T | undefined;
  };

  const getPreviousCachedIncluded = <T>(partialKey: string) => {
    for (const key of cache.keys()) {
      if (key.includes(partialKey)) {
        return cache.get(key)?.data as T | undefined;
      }
    }
  };

  const matchKeyList = (matchStrs: string[]) => {
    const result = [];

    for (const cacheKey of cache.keys()) {
      if (matchStrs.every((str, i) => cacheKey.includes(str))) {
        result.push(cacheKey);
      }
    }

    return result;
  };

  const getMatchedAndExcludedKeyList = (matchStrs: string[], excludeKey: string | string[]) => {
    const matchedKeys = matchKeyList(matchStrs);

    return matchedKeys.filter((key) => unstable_serialize(excludeKey) !== key);
  };

  const hasKey = (key: string | string[]) => {
    return cache.get(unstable_serialize(key)) !== undefined;
  };

  return {
    getSynchronizedData,
    getPreviousCachedData,
    matchKeyList,
    getPreviousCachedIncluded,
    hasKey,
    getMatchedAndExcludedKeyList,
  };
};
