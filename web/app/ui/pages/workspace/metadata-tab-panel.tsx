import { useStore } from '@/app/store';
import { MetadataList } from '../../components/numerical-guidance/metadata-list';
import Button from '../../components/view/atom/button';
import { IndicatorBoardMetadata } from '@/app/api/type/numerical-guidance.type';
import { useIndicatorMetadataList } from '@/app/hooks/use-indicator-metadata-list.hook';

export default function MetadataTabPanel() {
  const { createAndSelectMetadata } = useIndicatorMetadataList();

  const handleClick = () => {
    const metadata: IndicatorBoardMetadata = {
      id: Math.random().toString(36),
      name: 'metadata1',
      indicators: [],
    };
    createAndSelectMetadata(metadata);
  };

  return (
    <div>
      <MetadataList />
      <Button onClick={handleClick}>create</Button>
    </div>
  );
}
