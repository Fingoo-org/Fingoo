import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';
import WindowList from '../../view/molocule/window-list';
import { ListChildComponentProps } from 'react-window';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';
import TinyInput from '../../view/atom/tiny-input/tiny-input';
import { SearchIcon } from '@heroicons/react/solid';
import SourceIndicatorSearchListItem from './source-indicator-search-list-item';
import { useMemo, useState } from 'react';
import { useIndicatorSearchList } from '@/app/business/hooks/custom-forecast-indicator/use-indicator-search-list.hooks';

export default function SourceIndicatorSearchList() {
  const [searchTerm, setSearchTerm] = useState('');

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorInfoResponse[]>) => {
    const indicator = data[index];

    return <SourceIndicatorSearchListItem item={indicator} style={style} />;
  };

  const handleSearchTermChange = (value: string) => {
    setSearchTerm(value);
  };

  const searchedIndicatorList = useIndicatorSearchList(searchTerm);

  return (
    <div className="flex h-full flex-col">
      <TinyInput onValueChange={handleSearchTermChange} withDebounce={500} icon={SearchIcon} defaultValue="" />
      <div className="flex-1 py-1.5 pl-6">
        <WindowList maxVieweditemCount={3} items={searchedIndicatorList || []} renderRow={render} />
      </div>
    </div>
  );
}
