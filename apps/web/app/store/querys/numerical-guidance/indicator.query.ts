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
  const { getPreviousCachedIncluded, getMatchedAndExcludedKeyList } = useSWRCache();
  const { startDate, interval, ids } = params;
  // fix: id마다 indicator Type 찾을 수 있도록 변경할 필요 있음 indicatorType은 다행이 key에 들어갈 필요는 없음
  const key = ids ? [`${API_PATH.liveIndicatorValue}`, interval, startDate, ...ids] : null;

  return useSWRImmutable<IndicatorsValueResponse, any, string[] | null>(key, async (key) => {
    if (process.env.NODE_ENV === 'test') {
      return await fetchLiveIndicatorsValue(key, indicatorInfos);
    }
    
    const candidateKey = getMatchedAndExcludedKeyList([API_PATH.liveIndicatorValue, interval, startDate], key);

    const ids = key?.slice(3);

    const cachedIds = ids.filter((id) => {
      return candidateKey.some((k) => k.includes(id));
    });

    const cachedData = cachedIds
      .map((id) => {
        const data = getPreviousCachedIncluded<IndicatorsValueResponse>(id);
        console.log(data);
        return data?.indicatorsValue.find((indicator) => indicator.indicatorId === id);
      })
      .filter((data) => !!data);

    const notCachedIds = ids.filter((id) => {
      return !candidateKey.some((k) => k.includes(id));
    });

    const newKey =
      notCachedIds.length > 0 ? [`${API_PATH.liveIndicatorValue}`, interval, startDate, ...notCachedIds] : null;

    if (!newKey) {
      return { indicatorsValue: cachedData };
    }

    const { indicatorsValue } = await fetchLiveIndicatorsValue(newKey, indicatorInfos);

    // function getCachedData = () => {

    // }

    return {
      indicatorsValue: [...cachedData, ...indicatorsValue],
    };
  });
};
