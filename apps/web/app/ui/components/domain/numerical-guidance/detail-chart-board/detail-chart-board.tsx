'use client';
import React, { useState, useEffect } from 'react';
import DetailChart from './detail-chart';
import IntervalToggleGroup from '../indicator-board/interval-toggle-group';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../../util/client-data-suspense';
import { Card } from '../../../view/molecule/card/card';
import { CardSkeleton } from '../../../view/skeletons';
import { cn } from '@/app/utils/style';
import { IndicatorType } from '@/app/store/stores/numerical-guidance/indicator-list.store';

type DetailChartBoardProps = {
  indicatorBoardMetadataId?: string;
  indicatorType: IndicatorType;
};

const DetailChartBoard = React.memo(function DetailChartBoard({
  indicatorBoardMetadataId,
  indicatorType,
}: DetailChartBoardProps) {
  const startDate = new Date().toISOString().split('T')[0];

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
          {indicatorBoardMetadataId && (
            <DetailChart
              indicatorId={indicatorBoardMetadataId}
              startDate={startDate}
              indicatorType={indicatorType}
              customColor="blue-500" // todo
            />
          )}
          <div className="">
            <IntervalToggleGroup indicatorBoardMetadataId={indicatorBoardMetadataId} />
          </div>
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
});

export default DetailChartBoard;
