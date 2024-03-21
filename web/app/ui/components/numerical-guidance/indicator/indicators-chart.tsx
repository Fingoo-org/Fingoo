'use client';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectedMetadataTittle from '../indicator-board-metadata/selected-metadata-title';
import ToggleButton from '../../view/atom/toggle-button/toggle-button';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
import AdvancedIndicatorsChart from './advanced-indicators-chart';
import SimpleIndicatorsChart from './simple-indicators-chart';
import Pending from '../../view/molocule/pending';

export default function IndicatorsChart() {
  const { isAdvancedChart, setIsAdvancedChart } = useIndicatorBoard();
  // refactor: 애 둘을 선언형으로 감추고 싶다. rule을 만들어서 해결하자. 이컴포넌트가 주요한 예시가 될 듯
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { formattedIndicatorsRows, isPending } = useLiveIndicatorsValueViewModel();

  const handleToggle = (active: boolean) => {
    setIsAdvancedChart(active);
  };

  return (
    <>
      <Pending isPending={isPending}>
        <div className="flex items-center justify-center">
          <SelectedMetadataTittle />
        </div>
        <div>
          <ToggleButton
            className="font-medium"
            size={'lg'}
            onToggle={handleToggle}
            disabled={selectedMetadata && formattedIndicatorsRows ? false : true}
            icon={CheckCircledIcon}
            text={'자세한 차트'}
          />
        </div>
        <div className="mt-4 h-72 w-full">
          {isAdvancedChart ? <AdvancedIndicatorsChart /> : <SimpleIndicatorsChart />}
        </div>
      </Pending>
    </>
  );
}
