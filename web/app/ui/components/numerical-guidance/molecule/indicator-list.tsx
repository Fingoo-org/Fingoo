import { ListChildComponentProps } from 'react-window';
import WindowList from '../../view/molocule/window-list';
import { useIndicatorList } from '@/app/business/hooks/indicator/use-indicator-list.hook';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import clsx from 'clsx';
import IndicatorListItem from '../atom/indicator-list-item';
import { IndicatorInfoResponse } from '@/app/store/querys/numerical-guidance/indicator.query';

const IndicatorList = React.memo(function IndicatorList() {
  const { indicatorList } = useIndicatorList();
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();

  const render = ({ index, style, data }: ListChildComponentProps<IndicatorInfoResponse[]>) => {
    const indicator = data[index];

    return <IndicatorListItem item={indicator} style={style} />;
  };

  return (
    <div role="tablist" className={clsx({ hidden: selectedMetadata === undefined })}>
      <WindowList height={200} itemHeight={64} items={indicatorList || []} renderRow={render} />
    </div>
  );
});

export default IndicatorList;
