import { useStore } from '@/app/store';
import { MetadataList } from '../../components/numerical-guidance/metadata-list';
import Button from '../../components/view/atom/button';

export default function MetadataTabPanel() {
  const addMetadata = useStore((state) => state.addMetadata);

  const handleMetadataCreate = () => {
    addMetadata({
      id: Math.random().toString(36),
      name: 'metadata1',
      indicators: [],
    });
  };

  return (
    <div>
      <MetadataList />
      <Button onClick={handleMetadataCreate}>create</Button>
    </div>
  );
}
