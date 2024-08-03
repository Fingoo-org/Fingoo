'use client';
import IndicatorsChart from '../indicator/indicators-chart';
import IntervalToggleGroup from './interval-toggle-group';
import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../../util/client-data-suspense';
import CustomForecastIndicatorStabilityCallout from '../custom-forecast-indicator/custom-forecast-indicator-stability-callout';
import React from 'react';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { cn } from '@/app/utils/style';
import { Card } from '../../../view/molecule/card/card';
import { CardSkeleton } from '../../../view/skeletons';
import { useSplitIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-split-indicator-board.hook';
import EditableMetadataTittle from '../indicator-board-metadata/editable-metadata-title';
import { useGenerateImage } from '@/app/utils/hooks/use-generate-image';
import { MetadataSharePopover } from './metadata-share-popover';
import ViewModeIcon from '../../../view/atom/viewmode-icon';
import { useViewMode } from '@/app/business/hooks/use-viewmode.hook';
import IconButton from '../../../view/atom/icons/icon-button';

type IndicatorBoardProps = {
  indicatorBoardMetadataId?: string;
};

const IndicatorBoard = React.memo(function IndicatorBoard({ indicatorBoardMetadataId }: IndicatorBoardProps) {
  const { selectedMetadataId, selectMetadataById } = useSelectedIndicatorBoardMetadata();
  const { splitScreen } = useSplitIndicatorBoard();
  const isSelected = indicatorBoardMetadataId ? selectedMetadataId === indicatorBoardMetadataId : false;

  const { ref, downloadImage, generateImageBlob } = useGenerateImage<HTMLDivElement>({
    imageName: 'chart-image',
  });

  const handleMetadataSelect = () => {
    if (indicatorBoardMetadataId) {
      selectMetadataById(indicatorBoardMetadataId);
    }
  };

  const { enableViewMode } = useViewMode();

  return (
    <Card
      onDoubleClick={handleMetadataSelect}
      className={cn('max-h-screen  w-full space-y-5 rounded-lg bg-white px-4 py-5', {
        'border-4 border-fingoo-main': isSelected,
        'max-h-[50vh] space-y-1 px-1 py-3': splitScreen === 'square',
      })}
    >
      <ClientDataSuspense
        fallback={
          <div className="pt-10">
            <CardSkeleton />
          </div>
        }
      >
        <SWRConfig value={{ suspense: true, keepPreviousData: true }}>
          <div className="relative flex items-center justify-center">
            <EditableMetadataTittle className="max-w-64" indicatorBoardMetadataId={indicatorBoardMetadataId!} />
            <div className="absolute right-3 top-1 flex items-center space-x-2">
              <IconButton icon={ViewModeIcon} className="cursor-pointer" onClick={enableViewMode} color="gray" />
              <MetadataSharePopover
                downloadImage={downloadImage}
                generateImageBlob={generateImageBlob}
                indicatorBoardMetadataId={indicatorBoardMetadataId}
              />
            </div>
          </div>
          <IndicatorsChart ref={ref} indicatorBoardMetadataId={indicatorBoardMetadataId} />
          <div className="">
            <IntervalToggleGroup indicatorBoardMetadataId={indicatorBoardMetadataId} />
          </div>
          <CustomForecastIndicatorStabilityCallout indicatorBoardMetadataId={indicatorBoardMetadataId} />
        </SWRConfig>
      </ClientDataSuspense>
    </Card>
  );
});

export default IndicatorBoard;
