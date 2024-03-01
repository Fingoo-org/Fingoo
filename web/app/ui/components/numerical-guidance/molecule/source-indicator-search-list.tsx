import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';
import WindowList from '../../view/molocule/window-list';
import { ListChildComponentProps } from 'react-window';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import TinyInput from '../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';
import SelectableItem from '../../view/atom/selectable-item';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import ToolTip from '../../view/atom/tooltip';
import { SparklesIcon } from '@heroicons/react/outline';
import Icon from '../../view/atom/icons/variant-icon';

export default function SourceIndicatorSearchList() {
  const { selectedCustomForecastIndicator } = useSelectedCustomForecastIndicatorViewModel();
  const { indicatorList } = useIndicatorList();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorInfoResponse[]>) => {
    const indicator = data[index];

    const handleSelect = () => {
      // logic: 재료 지표 선택
      console.log('handleSelect');
    };

    const handleDeSelect = () => {
      // logic: 재료 지표 선택 해제
      console.log('handleDeSelect');
    };

    const indicatorDisplayName = `${indicator.ticker}(${indicator.name})`;

    const isTargetIndicator = selectedCustomForecastIndicator?.targetIndicatorId === indicator.id;
    const isSelected = selectedCustomForecastIndicator?.sourceIndicatorIds?.includes(indicator.id) || isTargetIndicator;

    return (
      <SelectableItem selected={isSelected} onSelect={handleSelect} onDeSelect={handleDeSelect} style={style}>
        <div className="flex w-full items-center justify-between">
          <span className="text-xs">{indicatorDisplayName}</span>
          {isTargetIndicator ? (
            <ToolTip message="대상 지표입니다.">
              <Icon size={'xs'} icon={SparklesIcon} />
            </ToolTip>
          ) : null}
        </div>
      </SelectableItem>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <TinyInput icon={SearchIcon} defaultValue="" />
      <div className="flex-1 py-1.5 pl-6">
        <WindowList maxVieweditemCount={3} items={indicatorList || []} renderRow={render} />
      </div>
    </div>
  );
}
