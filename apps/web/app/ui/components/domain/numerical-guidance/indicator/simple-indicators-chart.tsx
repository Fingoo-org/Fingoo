import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-live-indicators-value-view-model.hook';
import MultiLineChart from '../../../view/molecule/multi-line-chart/multi-line-chart';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { createIndicatorFormatter } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import { useIndicatorBoardSize } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board-size.hook';

type SimpleIndicatorsChartProps = {
  indicatorBoardMetadataId?: string;
};

export default function SimpleIndicatorsChart({ indicatorBoardMetadataId }: SimpleIndicatorsChartProps) {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { indicatorsValue } = useLiveIndicatorsValueViewModel(indicatorBoardMetadata?.id);
  const { customForecastIndicatorsValue } = useCustomForecastIndicatorsValueViewModel(indicatorBoardMetadata?.id);

  const { chartHeight } = useIndicatorBoardSize({ indicatorBoardMetadataId });

  const indicatorFormatter = createIndicatorFormatter(
    indicatorsValue?.indicatorsValue ?? [],
    customForecastIndicatorsValue ?? [],
  );

  const formattedIndicatorsRows = indicatorFormatter.formattedIndicatorsInRow;

  if (!indicatorBoardMetadata?.indicatorIdsWithSectionIds) {
    return (
      <MultiLineChart
        data={indicatorBoardMetadata ? formattedIndicatorsRows : []}
        categories={[]}
        noDataText={
          indicatorBoardMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'
        }
        height={chartHeight}
      />
    );
  }

  const chartNumber = Object.keys(indicatorBoardMetadata?.indicatorIdsWithSectionIds).length;

  return (
    <>
      {Array.from({ length: chartNumber }, () => 0).map((sectionId, index) => {
        const indicatorIds = indicatorBoardMetadata?.indicatorIdsWithSectionIds[`section${index + 1}`];

        const categories = indicatorFormatter
          .getIdentifiersByIds(indicatorIds)
          .map((indicator) => indicator.identifier);

        return (
          <MultiLineChart
            data-testid={`simple-indicators-chart-section${index + 1}`}
            key={sectionId}
            data={indicatorBoardMetadata ? formattedIndicatorsRows : []}
            categories={categories}
            noDataText={getNoDataText(categories)}
            syncId={indicatorBoardMetadataId}
            height={chartHeight}
          />
        );
      })}
    </>
  );

  function getNoDataText(categories: string[]) {
    if (indicatorBoardMetadata) {
      return categories.length === 0
        ? '선택한 지표가 없습니다. 지표를 선택해주세요'
        : '지표에 해당하는 날짜에 대한 데이터가 없습니다.';
    }

    return '메타데이터를 선택해주세요';
  }
}
