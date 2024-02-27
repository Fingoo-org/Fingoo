import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
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
      withResetButton={true}
      withDebounce={500}
      className={clsx('w-40 p-0 text-center text-lg font-medium', {
        'focus:text-gray-500': selectedMetadata,
      })}
      defaultValue={selectedMetadata ? selectedMetadata.name : 'No metadata'}
    />
  );
}
