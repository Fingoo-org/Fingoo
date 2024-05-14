import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import EditableText from '../../view/atom/editable-text';
import clsx from 'clsx';

type EditableMetadataTittleProps = {
  indicatorBoardMetadataId?: string;
};

export default function EditableMetadataTittle({ indicatorBoardMetadataId }: EditableMetadataTittleProps) {
  const { indicatorBoardMetadata, updateIndicatorBoardMetadata } =
    useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const handleMetadataNameChange = (name: string) => {
    updateIndicatorBoardMetadata({
      name,
    });
  };

  return (
    <EditableText
      inputKey={indicatorBoardMetadata?.id}
      onChangeValue={handleMetadataNameChange}
      readonly={indicatorBoardMetadata ? false : true}
      withResetButton={true}
      withDebounce={500}
      className={clsx('w-40 p-0 text-center text-xl font-medium', {
        'focus:text-gray-500': indicatorBoardMetadata,
      })}
      defaultValue={indicatorBoardMetadata ? indicatorBoardMetadata.name : 'No metadata'}
    />
  );
}
