'use client';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-live-indicators-value-view-model.hook';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import AdvancedIndicatorsChart from './advanced-indicators-chart';
import SimpleIndicatorsChart from './simple-indicators-chart';
import Pending from '../../../view/molecule/pending';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import DateRangeNavigator from './date-range-navigator';
import React from 'react';

type IndicatorsChartProps = {
  indicatorBoardMetadataId?: string;
};

const IndicatorChart = React.forwardRef<HTMLDivElement, IndicatorsChartProps>(function IndicatorsChart(
  { indicatorBoardMetadataId },
  ref,
) {
  const { isAdvancedChart, setIsAdvancedChart } = useIndicatorBoard(indicatorBoardMetadataId);
  const { indicatorBoardMetadata, uploadIndicatorBoardMetadataImage } =
    useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { isPending: isLiveIndicatorPending } = useLiveIndicatorsValueViewModel(indicatorBoardMetadata?.id);
  const { isPending: isCustomForecastIndicatorPending } = useCustomForecastIndicatorsValueViewModel(
    indicatorBoardMetadata?.id,
  );

  // const handleToggle = (active: boolean) => {
  //   setIsAdvancedChart(active);
  // };

  return (
    <Pending isPending={isLiveIndicatorPending || isCustomForecastIndicatorPending}>
      <div className="relative">
        <div className="flex px-14">
          <DateRangeNavigator indicatorBoardMetadataId={indicatorBoardMetadataId!} />
        </div>
        <div ref={ref} className="w-full px-8" data-testid="indicators-chart">
          {isAdvancedChart ? (
            <AdvancedIndicatorsChart indicatorBoardMetadataId={indicatorBoardMetadataId} />
          ) : (
            <SimpleIndicatorsChart indicatorBoardMetadataId={indicatorBoardMetadataId} />
          )}
        </div>
        {/* <div className="absolute left-3 top-1">
          <ToggleButton
            onToggle={handleToggle}
            disabled={indicatorBoardMetadata && indicatorsValue ? false : true}
            text={'자세한 차트'}
          />
        </div> */}
      </div>
    </Pending>
  );
});

export default IndicatorChart;
