import {
  HistoryIndicatorValueResponse,
  HistoryIndicatorsValueResponse,
  useFetchHistoryIndicatorValue,
} from '@/app/store/querys/numerical-guidance/history-indicator.query';
import { useEffect, useMemo, useState } from 'react';
import { convertHistoryIndicatorsValueViewModel } from '../../services/view-model/indicator-value/actual-indicators-value-view-model.service';
import { useSelectedIndicatorBoardMetadata } from '../indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useCustomForecastIndicatorListViewModel } from '../custom-forecast-indicator/use-custom-forecast-indicator-list-view-model.hook';
import {
  CustomForecastIndicatorResponse,
  useFetchCustomForecastIndicatorList,
} from '@/app/store/querys/numerical-guidance/custom-forecast-indicator.query';
import { convertCustomForecastHistoryIndicatorsValueViewModel } from '../../services/view-model/indicator-value/custom-forecast-indicator-value-view-model.service';

const mergePaginationData = (historyIndicatorsValuePages: HistoryIndicatorsValueResponse[] | undefined) => {
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
};

export const useHistoryIndicatorsValueViewModel = () => {
  const [paginationData, setPaginationData] = useState<{ rowsToDownload: number } | undefined>(undefined);
  const [initialCursorDate, setInitialCursorDate] = useState<Date>(new Date());
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const interval = useWorkspaceStore((state) => state.interval);
  const { data: customForecastIndicatorListData } = useFetchCustomForecastIndicatorList();

  const { data: actualHistoryIndicatorsValuePages, setSize: setActualPageSize } = useFetchHistoryIndicatorValue(
    selectedMetadata?.indicatorIds,
    {
      rowsToDownload: paginationData?.rowsToDownload ?? 10,
      initialCursorDate,
    },
    interval,
    'actual-history-indicators-value',
  );

  const selectedCustomForeacastIndicator = useMemo(() => {
    if (selectedMetadata === undefined || customForecastIndicatorListData === undefined) return undefined;

    return selectedMetadata.customForecastIndicatorIds
      .map((customForecastIndicatorId) => {
        return customForecastIndicatorListData.find(
          (customForecastIndicator) => customForecastIndicator.id === customForecastIndicatorId,
        );
      })
      .filter((indicator) => indicator !== undefined) as CustomForecastIndicatorResponse[];
  }, [selectedMetadata, customForecastIndicatorListData]);

  const { data: customForecastHistoryIndicatorsValuePages, setSize: setCustomForecastPageSize } =
    useFetchHistoryIndicatorValue(
      selectedCustomForeacastIndicator?.map((indicator) => indicator.targetIndicatorId),
      {
        rowsToDownload: paginationData?.rowsToDownload ?? 10,
        initialCursorDate,
      },
      interval,
      'custom-forecast-history-indicators-value',
    );

  useEffect(() => {
    if (paginationData === undefined) return;

    setActualPageSize((prev) => prev + 1);
    setCustomForecastPageSize((prev) => prev + 1);
  }, [paginationData]);

  const actualHistoryIndicatorsValue = useMemo(() => {
    return mergePaginationData(actualHistoryIndicatorsValuePages);
  }, [actualHistoryIndicatorsValuePages]);

  const customForecastHistoryIndicatorsValue = useMemo(() => {
    return mergePaginationData(customForecastHistoryIndicatorsValuePages);
  }, [customForecastHistoryIndicatorsValuePages]);

  console.log(actualHistoryIndicatorsValue);
  const convertedActualHistoryIndicatorsValue = useMemo(() => {
    if (!actualHistoryIndicatorsValue) return undefined;

    return convertHistoryIndicatorsValueViewModel(actualHistoryIndicatorsValue);
  }, [actualHistoryIndicatorsValue]);

  const convertedCustomForecastHistoryIndicatorsValue = useMemo(() => {
    if (!customForecastHistoryIndicatorsValue || !selectedCustomForeacastIndicator) return undefined;

    return convertCustomForecastHistoryIndicatorsValueViewModel(
      customForecastHistoryIndicatorsValue,
      selectedCustomForeacastIndicator,
    );
  }, [customForecastHistoryIndicatorsValue, selectedCustomForeacastIndicator]);

  console.log(convertedActualHistoryIndicatorsValue);
  return {
    actualHistoryIndicatorsValue: convertedActualHistoryIndicatorsValue,
    customForecastHistoryIndicatorsValue: convertedCustomForecastHistoryIndicatorsValue,
    interval,
    setPaginationData,
    setInitialCursorDate,
  };
};
