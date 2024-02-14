import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import EditableText from '../view/atom/editable-text';
import { useDebouncedCallback } from 'use-debounce';

export default function SelectedMetadataTittle() {
  const { selectedMetadata, updateMetadata } = useSelectedIndicatorBoardMetadata();
  const handleMetadataNameChange = useDebouncedCallback((name: string) => {
    updateMetadata({
      name,
    });
  }, 500);
  return (
    <EditableText
      inputKey={selectedMetadata?.id}
      onChange={handleMetadataNameChange}
      readonly={selectedMetadata ? false : true}
      className="w-40 text-lg font-medium p-0"
      text={selectedMetadata ? selectedMetadata.name : 'No metadata'}
    />
  );
}
