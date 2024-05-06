import { useHistoryIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-history-indicators-value-view-model.hook';
import AdvancedMultiLineChart from '../../view/molecule/advanced-multi-line-chart/advanced-multi-line-chart';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-live-indicators-value-view-model.hook';
import { useEffect } from 'react';
import { createIndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

type AdvancedIndicatorsChartProps = {
  indicatorBoardMetadataId?: string;
};

export default function AdvancedIndicatorsChart({ indicatorBoardMetadataId }: AdvancedIndicatorsChartProps) {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const {
    actualHistoryIndicatorsValue,
    customForecastHistoryIndicatorsValue,
    setPaginationData,
    setInitialCursorDate,
  } = useHistoryIndicatorsValueViewModel(indicatorBoardMetadata?.id);
  const { indicatorsValue } = useLiveIndicatorsValueViewModel(indicatorBoardMetadata?.id);
  const { customForecastIndicatorsValue } = useCustomForecastIndicatorsValueViewModel(indicatorBoardMetadata?.id);

  const indicatorFormatter = createIndicatorFormatter(
    indicatorsValue?.indicatorsValue ?? [],
    customForecastIndicatorsValue ?? [],
  );
  const historyIndicatorFormatter = createIndicatorFormatter(
    actualHistoryIndicatorsValue?.indicatorsValue ?? [],
    customForecastHistoryIndicatorsValue ?? [],
  );

  // fix: unit type이 서로 다른 문제 발생.. 병합해서 처리할 필요가 있음
  const formattedLiveIndicatorsRows = indicatorFormatter.formattedIndicatorsInRow;
  const formattedHistoryIndicatorsRows = historyIndicatorFormatter.formattedIndicatorsInRow;

  const startDate = formattedLiveIndicatorsRows[0]?.date as string;

  const formattedAdvencedIndicatorsRows = [
    ...(formattedHistoryIndicatorsRows || []),
    ...(formattedLiveIndicatorsRows || []),
  ];

  const initialLength = formattedLiveIndicatorsRows?.length || 0;
  const initialIndex = initialLength - (formattedAdvencedIndicatorsRows?.length || 0);

  const categoriesList = indicatorBoardMetadata?.indicatorIdsWithSectionIds
    ? Object.keys(indicatorBoardMetadata?.indicatorIdsWithSectionIds).map((sectionId, index) => {
        const indicatorIds = indicatorBoardMetadata?.indicatorIdsWithSectionIds[`section${index + 1}`];

        const categories = indicatorFormatter
          .getIdentifiersByIds(indicatorIds)
          .map((indicator) => indicator.identifier);
        return categories;
      })
    : [[]];

  useEffect(() => {
    if (startDate) {
      setInitialCursorDate(new Date(startDate));
    }
  }, [startDate]);

  const handleLoadData = (rowsToDownload: number, initialIndex: number) => {
    setPaginationData({
      rowsToDownload,
    });
  };

  return (
    <AdvancedMultiLineChart
      displayRowsSize={initialLength}
      initialIndex={initialIndex}
      onLoadData={handleLoadData}
      categoriesList={categoriesList}
      data={formattedAdvencedIndicatorsRows || []}
    />
  );
}
