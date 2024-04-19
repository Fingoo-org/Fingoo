'use client';
import { useLiveIndicatorsValueViewModel } from '@/app/business/hooks/indicator/use-live-indicators-value-view-model.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import SelectedMetadataTittle from '../indicator-board-metadata/selected-metadata-title';
import ToggleButton from '../../view/atom/toggle-button/toggle-button';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { useIndicatorBoard } from '@/app/business/hooks/use-indicator-board.hook';
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
  const { isAdvancedChart, setIsAdvancedChart } = useIndicatorBoard();
  // refactor: 애 둘을 선언형으로 감추고 싶다. rule을 만들어서 해결하자. 이컴포넌트가 주요한 예시가 될 듯
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { indicatorsValue, isPending: isLiveIndicatorPending } = useLiveIndicatorsValueViewModel(selectedMetadata?.id);
  const { isPending: isCustomForecastIndicatorPending } = useCustomForecastIndicatorsValueViewModel();
  const { uploadIndicatorBoardMetadataImage } = useIndicatorBoardMetadataViewModel(undefined);
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
          <SelectedMetadataTittle />
        </div>
        <div className="px-14 pb-1">
          <ToggleButton
            onToggle={handleToggle}
            disabled={selectedMetadata && indicatorsValue ? false : true}
            text={'자세한 차트'}
          />
        </div>
        <div ref={ref} className="w-full px-8" data-testid="indicators-chart">
          {isAdvancedChart ? <AdvancedIndicatorsChart /> : <SimpleIndicatorsChart />}
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
