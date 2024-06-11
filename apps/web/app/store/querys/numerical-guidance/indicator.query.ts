import useSWRImmutable from 'swr/immutable';

import { API_PATH } from '../api-path';
import { fetchLiveIndicatorsValue } from '../fetcher';
import { Interval } from '../../stores/numerical-guidance/indicator-board.store';
import { IndicatorType } from '../../stores/numerical-guidance/indicator-list.store';
import { useSWRCache } from '../use-swr-cache.hook';

export type IndicatorsValueResponse = {
  indicatorsValue: IndicatorValueResponse[];
};

export type IndicatorValueResponse = {
  indicatorId: string;
  symbol: string;
  type: IndicatorType;
  values: IndicatorValueItemResponse[];
};

export type IndicatorValueItemResponse = {
  date: string;
  value: number | string;
};

export type LiveIndicatorRequestParams = {
  startDate: string;
  interval: Interval;
  ids: string[] | undefined;
};

export type IndicatorInfo = { id: string; indicatorType: IndicatorType };

export const useFetchLiveIndicatorsValueByType = (
  params: LiveIndicatorRequestParams,
  indicatorInfos: IndicatorInfo[],
) => {
  const { getCachedData, createNewKey } = useCachedLiveData();

  const { startDate, interval, ids } = params;
  // fix: id마다 indicator Type 찾을 수 있도록 변경할 필요 있음 indicatorType은 다행이 key에 들어갈 필요는 없음
  const key = ids ? [`${API_PATH.liveIndicatorValue}`, interval, startDate, ...ids] : null;

  return useSWRImmutable<IndicatorsValueResponse, any, string[] | null>(key, async (key) => {
    if (process.env.NODE_ENV === 'test') {
      return await fetchLiveIndicatorsValue(key, indicatorInfos);
    }

    const cachedData = getCachedData(key);

    const newKey = createNewKey(key);

    if (!newKey) {
      return { indicatorsValue: cachedData };
    }

    console.log('newKey', newKey);
    const { indicatorsValue } = await fetchLiveIndicatorsValue(newKey, indicatorInfos);

    return {
      indicatorsValue: [...cachedData, ...indicatorsValue],
    };
  });
};

const useCachedLiveData = () => {
  const { getPreviousCachedIncluded, getMatchedAndExcludedKeyList } = useSWRCache();

  function getCachedData(key: string[]) {
    const matchStrs = key.slice(0, 3);
    const candidateKey = getMatchedAndExcludedKeyList(matchStrs, key);
    const indicatorIds = key.slice(3);

    const cachedIds = indicatorIds.filter((id) => {
      return candidateKey.some((k) => k.includes(id));
    });

    const cachedData = cachedIds
      .map((id) => {
        const data = getPreviousCachedIncluded<IndicatorsValueResponse>(id);
        return data?.indicatorsValue.find((indicator) => indicator.indicatorId === id);
      })
      .filter((data) => !!data);

    return cachedData;
  }

  function createNewKey(key: string[]) {
    const matchStrs = key.slice(0, 3);
    const candidateKey = getMatchedAndExcludedKeyList(matchStrs, key);
    const indicatorIds = key.slice(3);

    const notCachedIds = indicatorIds.filter((id) => {
      return !candidateKey.some((k) => k.includes(id));
    });

    return notCachedIds.length > 0 ? [...key.slice(0, 3), ...notCachedIds] : null;
  }

  return { getCachedData, createNewKey };
};
