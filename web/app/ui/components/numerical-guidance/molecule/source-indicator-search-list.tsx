import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';
import WindowList from '../../view/molocule/window-list';
import { ListChildComponentProps } from 'react-window';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import TinyInput from '../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';
import { useSelectedCustomForecastIndicatorViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-selected-custom-forecast-indicator-view-model';
import SourceIndicatorSearchListItem from '../atom/source-indicator-search-list-item';

export default function SourceIndicatorSearchList() {
  const { indicatorList } = useIndicatorList();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorInfoResponse[]>) => {
    const indicator = data[index];

    return <SourceIndicatorSearchListItem item={indicator} style={style} />;
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
