import {
  HistoryIndicatorValueResponse,
  useFetchHistoryIndicatorValue,
} from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { convertHistoryIndicatorsValueViewModel } from '../../services/view-model/indicator-value/actual-indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';

export const useHistoryIndicatorsValueViewModel = () => {
  const [paginationData, setPaginationData] = useState<{ rowsToDownload: number } | undefined>(undefined);
  const [initialCursorDate, setInitialCursorDate] = useState<Date>(new Date());
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const interval = useWorkspaceStore((state) => state.interval);

  const { data: historyIndicatorsValuePages, setSize: setPageSize } = useFetchHistoryIndicatorValue(
    selectedMetadata?.indicatorIds,
    {
      rowsToDownload: paginationData?.rowsToDownload ?? 10,
      initialCursorDate,
    },
    interval,
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

  return {
    historyIndicatorsValue: convertedHistoryIndicatorsValue,
    interval,
    setPaginationData,
    setInitialCursorDate,
  };
};
