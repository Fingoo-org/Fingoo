import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-live-indicators-value-view-model.hook';
import { createIndicatorFormatter } from '@/app/business/services/chart/indicator-formatter.service';
import { CSVLink } from 'react-csv';

type CSVDownloadButtonProps = {
  indicatorBoardMetadataId?: string;
};

export default function CSVDownloadButton({ indicatorBoardMetadataId }: CSVDownloadButtonProps) {
  const { indicatorsValue } = useLiveIndicatorsValueViewModel(indicatorBoardMetadataId);
  const { customForecastIndicatorsValue } = useCustomForecastIndicatorsValueViewModel(indicatorBoardMetadataId);

  const indicatorFormatter = createIndicatorFormatter(
    indicatorsValue?.indicatorsValue ?? [],
    customForecastIndicatorsValue ?? [],
  );

  return <CSVLink data={indicatorFormatter.formmatedIndicatorsToCSV}>Download CSV</CSVLink>;
}
