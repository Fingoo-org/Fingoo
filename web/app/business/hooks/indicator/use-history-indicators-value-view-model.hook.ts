import {
  HistoryIndicatorValueResponse,
  useFetchHistoryIndicatorValue,
} from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { useEffect, useMemo, useState } from 'react';
import { convertHistoryIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export const useHistoryIndicatorsValueViewModel = () => {
  const [rowsToDownload, setRowsToDownload] = useState<number | undefined>(undefined);
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const { data: historyIndicatorsValuePages, setSize } = useFetchHistoryIndicatorValue(
    selectedMetadata?.indicatorIds,
    rowsToDownload,
  );

  useEffect(() => {
    if (rowsToDownload === undefined) return;

    setSize((prev) => prev + 1);
  }, [rowsToDownload]);

  // merge pagination data
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

  const formattedHistoryIndicatorsRows = convertedHistoryIndicatorsValue?.formattedIndicatorsInRow;

  // view 모델 변환

  return {
    historyIndicatorsValue: convertedHistoryIndicatorsValue,
    formattedHistoryIndicatorsRows,
    setSize,
    setRowsToDownload,
  };
};
