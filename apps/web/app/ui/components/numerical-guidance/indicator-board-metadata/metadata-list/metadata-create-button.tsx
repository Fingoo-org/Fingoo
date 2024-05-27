import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import Button from '../../../view/atom/button/button';
import { PlusIcon } from '@heroicons/react/solid';
import { Loader2 } from 'lucide-react';

export default function MetadataCreateButton() {
  const { createIndicatorBoardMetadata, isCreateIndicatorMetadataMutating } = useIndicatorBoardMetadataList();

  const handleMetadataCreateAndSelect = async () => {
    const metadata = {
      indicatorBoardMetadataName: 'metadata1',
    };

    const indicatorBoardMetadataId = await createIndicatorBoardMetadata(metadata);
  };

  return (
    <Button
      color={'slate'}
      variant={'light'}
      className="rounded-lg bg-fingoo-gray-1.5 px-2 py-1 text-fingoo-gray-5"
      onClick={handleMetadataCreateAndSelect}
    >
      {isCreateIndicatorMetadataMutating ? (
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4 pr-1 font-semibold" />
      )}
      메타데이터 추가
    </Button>
  );
}
