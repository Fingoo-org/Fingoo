import { useIndicatorListByType } from '@/app/business/hooks/numerical-guidance/indicator/use-indicator-list-by-type.hook';
import { Indicator } from '@/app/business/services/numerical-guidance/view-model/indicator-list/indicators/indicator.service';
import { ListChildComponentProps } from 'react-window';
import WindowList from '../../../../view/molecule/window-list';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import IndicatorListItem from './indicator-list-item';
import { cn } from '@/app/utils/style';
import { useSearchedIndicatorList } from '@/app/business/hooks/numerical-guidance/indicator/use-searched-indicator-list.hooks';
import Pending from '../../../../view/molecule/pending';

export default function IndicatorListResult() {
  const { searchedIndicatorList, isLoading } = useSearchedIndicatorList();
  const { indicatorList, loadMoreIndicators } = useIndicatorListByType();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];
    const isLast = index === data.length - 1;

    if (isLast && !searchedIndicatorList) {
      return (
        <div style={style}>
          <IndicatorListItem item={indicator} />
          <div className="text-gray-400">Loading...</div>
        </div>
      );
    }

    return <IndicatorListItem item={indicator} style={style} />;
  };

  return (
    <div className={cn('h-[24vh] pt-1', { hidden: selectedMetadata === undefined })}>
      <Pending isPending={isLoading}>
        <WindowList
          loadMoreItems={loadMoreIndicators}
          maxVieweditemCount={4.5}
          items={searchedIndicatorList ? searchedIndicatorList : indicatorList || []}
          renderRow={render}
        />
      </Pending>
    </div>
  );
}
