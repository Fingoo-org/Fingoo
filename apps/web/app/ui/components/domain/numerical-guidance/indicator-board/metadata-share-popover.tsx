import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import React from 'react';
import { useCallback, useState } from 'react';
import ImageSharePopover from '../../../view/molecule/image-share-popover/image-share-popover';
import CSVDownloadButton from '../indicator/csv-download-button';

const BASE_URL =
  'https://ubxtslkqovlqrxvvxqea.supabase.co/storage/v1/object/public/fingoo_bucket/indicatorBoardMetadata';

type MetadataSharePopoverProp = {
  indicatorBoardMetadataId?: string;
  downloadImage: () => void;
  generateImageBlob: () => Promise<Blob | null | undefined>;
};

export function MetadataSharePopover({
  indicatorBoardMetadataId,
  downloadImage,
  generateImageBlob,
}: MetadataSharePopoverProp) {
  const { uploadIndicatorBoardMetadataImage } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);
  const [imageUrl, setImageUrl] = useState<string>('');

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
  );
}
