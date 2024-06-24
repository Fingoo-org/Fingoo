'use client';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/indicator/use-live-indicators-value-view-model.hook';
import EditableMetadataTittle from '../indicator-board-metadata/editable-metadata-title';
import ToggleButton from '../../../view/atom/toggle-button/toggle-button';
import { useIndicatorBoard } from '@/app/business/hooks/numerical-guidance/indicator-board/use-indicator-board.hook';
import AdvancedIndicatorsChart from './advanced-indicators-chart';
import SimpleIndicatorsChart from './simple-indicators-chart';
import Pending from '../../../view/molecule/pending';
import { useCallback, useState } from 'react';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/numerical-guidance/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useGenerateImage } from '../../../../../utils/hooks/use-generate-image';
import ImageSharePopover from '../../../view/molecule/image-share-popover/image-share-popover';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import CSVDownloadButton from './csv-download-button';
import DateRangeNavigator from './date-range-navigator';
import React from 'react';

const BASE_URL =
  'https://ubxtslkqovlqrxvvxqea.supabase.co/storage/v1/object/public/fingoo_bucket/indicatorBoardMetadata';

type IndicatorsChartProps = {
  indicatorBoardMetadataId?: string;
};

const IndicatorChart = React.forwardRef<HTMLDivElement, IndicatorsChartProps>(function IndicatorsChart(
  { indicatorBoardMetadataId },
  ref,
) {
  const { isAdvancedChart, setIsAdvancedChart } = useIndicatorBoard(indicatorBoardMetadataId);
  const { indicatorBoardMetadata, uploadIndicatorBoardMetadataImage } =
    useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { isPending: isLiveIndicatorPending } = useLiveIndicatorsValueViewModel(indicatorBoardMetadata?.id);
  const { isPending: isCustomForecastIndicatorPending } = useCustomForecastIndicatorsValueViewModel(
    indicatorBoardMetadata?.id,
  );

  // const handleToggle = (active: boolean) => {
  //   setIsAdvancedChart(active);
  // };

  return (
    <Pending isPending={isLiveIndicatorPending || isCustomForecastIndicatorPending}>
      <div className="relative">
        <div className="flex px-14">
          <DateRangeNavigator indicatorBoardMetadataId={indicatorBoardMetadataId!} />
        </div>
        <div ref={ref} className="w-full px-8" data-testid="indicators-chart">
          {isAdvancedChart ? (
            <AdvancedIndicatorsChart indicatorBoardMetadataId={indicatorBoardMetadataId} />
          ) : (
            <SimpleIndicatorsChart indicatorBoardMetadataId={indicatorBoardMetadataId} />
          )}
        </div>
        {/* <div className="absolute right-3 top-1">
          <ImageSharePopover
            baseUrl={BASE_URL}
            url={`/${imageUrl}`}
            onPopoverTriggerClick={handleImageUrlCreate}
            onDownloadImage={handleImageDownload}
            disabled={!indicatorBoardMetadataId ? true : false}
          >
            <div className="flex w-full justify-center pt-4">
              <CSVDownloadButton indicatorBoardMetadataId={indicatorBoardMetadataId} />
            </div>
          </ImageSharePopover>
        </div> */}
        <MetadataSharePopover indicatorBoardMetadataId={indicatorBoardMetadataId} />
        {/* <div className="absolute left-3 top-1">
          <ToggleButton
            onToggle={handleToggle}
            disabled={indicatorBoardMetadata && indicatorsValue ? false : true}
            text={'자세한 차트'}
          />
        </div> */}
      </div>
    </Pending>
  );
});

export default IndicatorChart;

type Prop = {
  indicatorBoardMetadataId?: string;
};

function MetadataSharePopover({ indicatorBoardMetadataId }: Prop) {
  const { uploadIndicatorBoardMetadataImage } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const [imageUrl, setImageUrl] = useState<string>('');

  const { ref, downloadImage, generateImageBlob } = useGenerateImage<HTMLDivElement>({
    imageName: 'chart-image',
  });

  const handleImageDownload = useCallback(async () => {
    await downloadImage();
  }, []);

  const handleImageUrlCreate = async () => {
    const imageFile = await generateImageBlob();
    if (imageFile) {
      const urlUUID = await uploadIndicatorBoardMetadataImage(imageFile);
      setImageUrl(urlUUID);
    }
  };
  return (
    <div className="absolute right-3 top-1">
      <ImageSharePopover
        baseUrl={BASE_URL}
        url={`/${imageUrl}`}
        onPopoverTriggerClick={handleImageUrlCreate}
        onDownloadImage={handleImageDownload}
        disabled={!indicatorBoardMetadataId ? true : false}
      >
        <div className="flex w-full justify-center pt-4">
          <CSVDownloadButton indicatorBoardMetadataId={indicatorBoardMetadataId} />
        </div>
      </ImageSharePopover>
    </div>
  );
}
