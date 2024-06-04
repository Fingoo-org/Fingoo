import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import CreateButton from '@/app/ui/components/view/molecule/create-button';
import { LogClick } from '@/app/logging/component/log-click';
export default function MetadataCreateButton() {
  const { metadataList, createIndicatorBoardMetadata, isCreateIndicatorMetadataMutating } =
    useIndicatorBoardMetadataList();

  const handleMetadataCreateAndSelect = async () => {
    const indicatorBoardMetadataId = await createIndicatorBoardMetadata();
  };

  return (
    <LogClick event={'click_metadata_create_button'} properties={{ metadata_item_count: metadataList?.length ?? -1 }}>
      <CreateButton
        onClick={handleMetadataCreateAndSelect}
        label={'메타데이터 추가'}
        isLoading={isCreateIndicatorMetadataMutating}
      />
    </LogClick>
  );
}
