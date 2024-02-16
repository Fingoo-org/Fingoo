import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import EditableText from '../../view/atom/editable-text';
import clsx from 'clsx';

export default function SelectedMetadataTittle() {
  const { selectedMetadata, updateMetadata } = useSelectedIndicatorBoardMetadata();

  const handleMetadataNameChange = (name: string) => {
    updateMetadata({
      name,
    });
  };

  return (
    <EditableText
      inputKey={selectedMetadata?.id}
      onChangeValue={handleMetadataNameChange}
      readonly={selectedMetadata ? false : true}
      resetWithButton={true}
      debounceDelay={500}
      className={clsx('w-40 text-lg font-medium p-0 ', {
        'focus:text-gray-500': selectedMetadata,
      })}
      defaultValue={selectedMetadata ? selectedMetadata.name : 'No metadata'}
    />
  );
}
