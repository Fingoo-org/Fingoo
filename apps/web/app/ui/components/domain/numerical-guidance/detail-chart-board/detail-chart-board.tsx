'use client';
import React from 'react';
import DetailChart from './detail-chart';
import IntervalToggleGroup from '../indicator-board/interval-toggle-group';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../../util/client-data-suspense';
import { Card } from '../../../view/molecule/card/card';
import { CardSkeleton } from '../../../view/skeletons';
import { cn } from '@/app/utils/style';

type DetailChartBoardProps = {
  indicatorBoardMetadataId?: string;
};

const DetailChartBoard = React.memo(function DetailChartBoard({ indicatorBoardMetadataId }: DetailChartBoardProps) {
  //
  const sampleData = [
    { date: '2023-09-01', value: 150 },
    { date: '2023-09-02', value: 170 },
    { date: '2023-09-03', value: 160 },
  ];

  const category = 'value'; // 차트 카테고리

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
          <DetailChart data={sampleData} category={category} customColor="blue-500" />
          <div className="">
            <IntervalToggleGroup indicatorBoardMetadataId={indicatorBoardMetadataId} />
          </div>
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
});

export default DetailChartBoard;
