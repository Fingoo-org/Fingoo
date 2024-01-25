import { useStore } from '@/app/store';
import { MetadataList } from '../../components/numerical-guidance/metadata-list';
import Button from '../../components/view/atom/button';
import { IndicatorBoardMetadata } from '@/app/store/indicator-board-metadata.slice';

export default function MetadataTabPanel() {
  const addMetadata = useStore((state) => state.addMetadata);
  const selectMetadata = useStore((state) => state.selectMetaData);

  const handleMetadataCreateAndSelect = () => {
    const metadata: IndicatorBoardMetadata = {
      id: Math.random().toString(36),
      name: 'metadata1',
      indicators: [],
    };
    addMetadata(metadata);
    selectMetadata(metadata.id);
  };

  return (
    <div>
      <MetadataList />
      <Button onClick={handleMetadataCreateAndSelect}>create</Button>
    </div>
  );
}
