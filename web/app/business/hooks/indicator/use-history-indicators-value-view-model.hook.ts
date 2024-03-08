import {
  HistoryIndicatorValueResponse,
  useFetchHistoryIndicatorValue,
} from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { convertHistoryIndicatorsValueViewModel } from '../../services/view-model/indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export const useHistoryIndicatorsValueViewModel = () => {
  const [paginationData, setPaginationData] = useState<{ rowsToDownload: number } | undefined>(undefined);
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const { data: historyIndicatorsValuePages, setSize: setPageSize } = useFetchHistoryIndicatorValue(
    selectedMetadata?.indicatorIds,
    paginationData?.rowsToDownload,
  );

  useEffect(() => {
    if (paginationData === undefined) return;

    setPageSize((prev) => prev + 1);
  }, [paginationData]);

  const mergePaginationData = useCallback(() => {
    return historyIndicatorsValuePages?.reduce((acc: HistoryIndicatorValueResponse[], page, index) => {
      if (index === 0) {
        return page.indicatorsValue.map((indicator) => indicator.data);
      }

      return (acc as HistoryIndicatorValueResponse[]).map((indicator) => {
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

  const historyIndicatorsValue = useMemo(() => {
    return mergePaginationData();
  }, [mergePaginationData]);

  const convertedHistoryIndicatorsValue = useMemo(() => {
    if (!historyIndicatorsValue) return undefined;

    return convertHistoryIndicatorsValueViewModel(historyIndicatorsValue);
  }, [historyIndicatorsValue]);

  const formattedHistoryIndicatorsRows = convertedHistoryIndicatorsValue?.formattedIndicatorsInRow;
  console.log('formattedHistoryIndicatorsRows', formattedHistoryIndicatorsRows);

  return {
    historyIndicatorsValue: convertedHistoryIndicatorsValue,
    formattedHistoryIndicatorsRows,
    setPaginationData,
  };
};
