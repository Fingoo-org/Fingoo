import { ListChildComponentProps } from 'react-window';
import WindowList from '../../../view/molecule/window-list';
import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import IndicatorListItem from './indicator-list-item';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator-list.query';
import { cn } from '@/app/utils/style';

const IndicatorList = React.memo(function IndicatorList() {
  const { indicatorList } = useIndicatorList();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorInfoResponse[]>) => {
    const indicator = data[index];

    return <IndicatorListItem item={indicator} style={style} />;
  };

  return (
    <div className={cn('h-72', { hidden: selectedMetadata === undefined })}>
      <WindowList maxVieweditemCount={8} items={indicatorList || []} renderRow={render} />
    </div>
  );
});

export default IndicatorList;
