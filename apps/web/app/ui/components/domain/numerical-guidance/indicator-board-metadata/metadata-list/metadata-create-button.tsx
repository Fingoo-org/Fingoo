import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import { useLogger } from '@/app/logging/logging-context';
import CreateButton from '@/app/ui/components/view/molecule/create-button';

export default function MetadataCreateButton() {
  const logger = useLogger(); 
  const { metadataList, createIndicatorBoardMetadata, isCreateIndicatorMetadataMutating } =
    useIndicatorBoardMetadataList();

  const handleMetadataCreateAndSelect = async () => {
    logger.track('click_metadata_create_button', {
      metadata_item_count: metadataList?.length ?? -1,
    });

    const indicatorBoardMetadataId = await createIndicatorBoardMetadata();
  };

  return (
    <CreateButton
      onClick={handleMetadataCreateAndSelect}
      label={'메타데이터 추가'}
      isLoading={isCreateIndicatorMetadataMutating}
    />
  );
}