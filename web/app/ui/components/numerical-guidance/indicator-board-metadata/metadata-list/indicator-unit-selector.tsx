import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import Select from '../../../view/molecule/select';

type IndicatorUnitSelectorProps = {
  indicatorBoardMetadataId: string;
  indicatorId: string;
};

export default function IndicatorUnitSelector({ indicatorBoardMetadataId, indicatorId }: IndicatorUnitSelectorProps) {
  const { indicatorsUnitType } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const { unitType } = indicatorsUnitType?.find((indicator) => indicator.indicatorId === indicatorId) || {
    unitType: 'default',
  };

  return (
    <Select value={unitType}>
      <Select.Trigger className="w-18 h-7">
        <Select.Value placeholder="unit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>unit type</Select.Label>
          <Select.Item value="default">default</Select.Item>
          <Select.Item value="index">index</Select.Item>
          <Select.Item value="MoM">MoM</Select.Item>
          {/* <Select.Item>percent</Select.Item> */}
        </Select.Group>
      </Select.Content>
    </Select>
  );
}
