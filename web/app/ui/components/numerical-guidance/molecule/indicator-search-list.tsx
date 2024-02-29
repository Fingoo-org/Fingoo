import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';
import WindowList from '../../view/molocule/window-list';
import { ListChildComponentProps } from 'react-window';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import TinyInput from '../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';
import SelectableItem from '../../view/atom/selectable-item';

export default function IndicatorSearchList() {
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

    return (
      <SelectableItem selected={false} onSelect={handleSelect} onDeSelect={handleDeSelect} style={style}>
        <span className="text-xs">{indicator.name}</span>
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
