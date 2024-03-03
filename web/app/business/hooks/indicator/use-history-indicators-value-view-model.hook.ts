import {
  HistoryIndicatorValueResponse,
  HistoryIndicatorsValueResponse,
  useFetchHistoryIndicatorValue,
} from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { useMemo } from 'react';
import { convertHistoryIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';

export const useHistoryIndicatorsValueViewModel = () => {
  const { data: historyIndicatorsValuePages, setSize } = useFetchHistoryIndicatorValue([
    '9785ba85-c924-4269-8238-e1f10b404177',
  ]);

  // merge
  const historyIndicatorsValue = useMemo(() => {
    return historyIndicatorsValuePages?.reduce((acc: HistoryIndicatorValueResponse[], page, index) => {
      if (index === 0) {
        return page.indicatorsValue.map((indicator) => indicator.data);
      }

      return (acc as HistoryIndicatorValueResponse[]).map((indicator, index) => {
        const targetIndicator = page.indicatorsValue.find(
          (pageIndicator) => pageIndicator.data.indicator.id === indicator.indicator.id,
        ) ?? { data: { values: [] } };

        return {
          ...indicator,
          values: [...indicator.values, ...targetIndicator.data.values],
        };
      });
    }, []);
  }, [historyIndicatorsValuePages]);

  const convertedHistoryIndicatorsValue = useMemo(() => {
    if (!historyIndicatorsValue) return undefined;

    return convertHistoryIndicatorsValueViewModel(historyIndicatorsValue);
  }, [historyIndicatorsValue]);

  // view 모델 변환

  return {
    historyIndicatorsValue: convertedHistoryIndicatorsValue,
    setSize,
  };
};
