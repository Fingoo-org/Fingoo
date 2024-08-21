import { useWorkspaceStore } from '@/app/store/stores/numerical-guidance/workspace.store';
import { useIndicatorBoardMetadataViewModel } from '../../numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';

export default function useAddAxis() {
  const selectedMetadataId = useWorkspaceStore((state) => state.selectedMetadataId);
  const { addsectionToIndicatorBoardMetadata } = useIndicatorBoardMetadataViewModel(selectedMetadataId);

  const addAxisHandler = () => {
    if (selectedMetadataId === undefined) {
      return '선택된 메타데이터가 없습니다. 메타데이터를 선택해주세요';
    }
    addsectionToIndicatorBoardMetadata();
    return '축 추가 완료';
  };
  return { addAxisHandler };
}
