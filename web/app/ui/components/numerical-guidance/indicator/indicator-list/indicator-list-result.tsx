import { useIndicatorListByType } from '@/app/business/hooks/indicator/use-indicator-list-by-type.hook';
import { Indicator } from '@/app/business/services/view-model/indicator-list/indicators/indicator.service';
import { ListChildComponentProps } from 'react-window';
import WindowList from '../../../view/molecule/window-list';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import IndicatorListItem from './indicator-list-item';
import { cn } from '@/app/utils/style';

export default function IndicatorListResult() {
  const { indicatorList, loadMoreIndicators } = useIndicatorListByType();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const render = ({ index, style, data }: ListChildComponentProps<Indicator[]>) => {
    const indicator = data[index];
    const isLast = index === data.length - 1;

    if (isLast) {
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
    <div className={cn('h-56', { hidden: selectedMetadata === undefined })}>
      <WindowList
        loadMoreItems={loadMoreIndicators}
        maxVieweditemCount={4.5}
        items={indicatorList || []}
        renderRow={render}
      />
    </div>
  );
}
