'use client';
import React, { useState, useEffect } from 'react';
import DetailChart from './detail-chart';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../../util/client-data-suspense';
import { Card } from '../../../view/molecule/card/card';
import { CardSkeleton } from '../../../view/skeletons';
import { cn } from '@/app/utils/style';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';
import DetailChartIntervalGroup from './detail-chart-interval-group';
import { useDetailBoardStore } from '@/app/store/stores/numerical-guidance/detail-board.store';

export type DetailChartBoardProps = {
  indicatorId: string;
  symbol: string;
  indicatorType: IndicatorType;
};

const DetailChartBoard = React.memo(function DetailChartBoard({
  indicatorId,
  symbol,
  indicatorType,
}: DetailChartBoardProps) {
  const { setInterval } = useDetailBoardStore((state) => state.actions);

  useEffect(() => {
    return () => {
      setInterval('day');
    };
  }, [indicatorId, setInterval]);

  return (
    <Card className={cn('max-h-screen w-full space-y-5 rounded-lg bg-white px-4 py-5')}>
      <ClientDataSuspense
        fallback={
          <div className="pt-10">
            <CardSkeleton />
          </div>
        }
      >
        <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
          <DetailChart indicatorId={indicatorId} symbol={symbol} indicatorType={indicatorType} />
          <div className="">
            <DetailChartIntervalGroup />
          </div>
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
});

export default DetailChartBoard;
