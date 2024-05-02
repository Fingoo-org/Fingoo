import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import MultiLineChart from '../../view/molecule/multi-line-chart/multi-line-chart';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { createIndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

type SimpleIndicatorsChartProps = {
  indicatorBoardMetadataId?: string;
};

export default function SimpleIndicatorsChart({ indicatorBoardMetadataId }: SimpleIndicatorsChartProps) {
  const { indicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { indicatorsValue } = useLiveIndicatorsValueViewModel(indicatorBoardMetadata?.id);
  const { customForecastIndicatorsValue } = useCustomForecastIndicatorsValueViewModel(indicatorBoardMetadata?.id);

  const indicatorFormatter = createIndicatorFormatter(
    indicatorsValue?.indicatorsValue ?? [],
    customForecastIndicatorsValue ?? [],
  );

  const formattedIndicatorsRows = indicatorFormatter.formattedIndicatorsInRow;

  return (
    <>
      {indicatorBoardMetadata?.indicatorIdsWithSectionIds ? (
        Object.keys(indicatorBoardMetadata?.indicatorIdsWithSectionIds).map((sectionId, index) => {
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
              noDataText={
                indicatorBoardMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'
              }
              syncId={indicatorBoardMetadataId}
              className="h-80"
            />
          );
        })
      ) : (
        <MultiLineChart
          data={indicatorBoardMetadata ? formattedIndicatorsRows : []}
          categories={[]}
          noDataText={
            indicatorBoardMetadata ? '선택한 지표가 없습니다. 지표를 선택해주세요' : '메타데이터를 선택해주세요'
          }
          className="h-80"
        />
      )}
    </>
  );
}
