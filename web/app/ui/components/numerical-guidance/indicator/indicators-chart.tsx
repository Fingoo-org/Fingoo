'use client';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import EditableMetadataTittle from '../indicator-board-metadata/editable-metadata-title';
import ToggleButton from '../../view/atom/toggle-button/toggle-button';
import { useIndicatorBoard } from '@/app/business/hooks/indicator-board/use-indicator-board.hook';
import AdvancedIndicatorsChart from './advanced-indicators-chart';
import SimpleIndicatorsChart from './simple-indicators-chart';
import Pending from '../../view/molecule/pending';
import { useCallback, useState } from 'react';
import { useCustomForecastIndicatorsValueViewModel } from '@/app/business/hooks/custom-forecast-indicator/use-custom-forecast-indicators-value-view-model.hook';
import { useGenerateImage } from '../../view/hooks/use-generate-image';
import ImageSharePopover from '../../view/molecule/image-share-popover/image-share-popover';
import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

const BASE_URL =
  'https://mlvbynpnwpxewztngrrz.supabase.co/storage/v1/object/public/fingoo_bucket/indicatorBoardMetadata';

type IndicatorsChartProps = {
  indicatorBoardMetadataId?: string;
};

export default function IndicatorsChart({ indicatorBoardMetadataId }: IndicatorsChartProps) {
  const { isAdvancedChart, setIsAdvancedChart } = useIndicatorBoard(indicatorBoardMetadataId);
  const { indicatorBoardMetadata, uploadIndicatorBoardMetadataImage } =
    useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const { indicatorsValue, isPending: isLiveIndicatorPending } = useLiveIndicatorsValueViewModel(
    indicatorBoardMetadata?.id,
  );
  const { isPending: isCustomForecastIndicatorPending } = useCustomForecastIndicatorsValueViewModel(
    indicatorBoardMetadata?.id,
  );
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

  const handleToggle = (active: boolean) => {
    setIsAdvancedChart(active);
  };

  return (
    <Pending isPending={isLiveIndicatorPending || isCustomForecastIndicatorPending}>
      <div className="relative">
        <div className="flex items-center justify-center">
          <EditableMetadataTittle indicatorBoardMetadataId={indicatorBoardMetadataId!} />
        </div>
        <div className="px-14 pb-1">
          <ToggleButton
            onToggle={handleToggle}
            disabled={indicatorBoardMetadata && indicatorsValue ? false : true}
            text={'자세한 차트'}
          />
        </div>
        <div ref={ref} className="w-full px-8" data-testid="indicators-chart">
          {isAdvancedChart ? (
            <AdvancedIndicatorsChart indicatorBoardMetadataId={indicatorBoardMetadataId} />
          ) : (
            <SimpleIndicatorsChart indicatorBoardMetadataId={indicatorBoardMetadataId} />
          )}
        </div>
        <div className="absolute right-3 top-1">
          <ImageSharePopover
            baseUrl={BASE_URL}
            url={`/${imageUrl}`}
            onPopoverTriggerClick={handleImageUrlCreate}
            onDownloadImage={handleImageDownload}
          />
        </div>
      </div>
    </Pending>
  );
}
