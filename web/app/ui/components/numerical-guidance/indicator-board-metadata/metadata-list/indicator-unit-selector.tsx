import { useIndicatorBoardMetadataViewModel } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-view-model.hook';
import Select from '../../../view/molecule/select';
import { unitTypes, UnitType } from '@/app/business/services/chart/unit-calculator/unit-calculator-factory.service';

type IndicatorUnitSelectorProps = {
  indicatorBoardMetadataId: string;
  indicatorId: string;
};

function isUnitType(unitType: string): unitType is UnitType {
  return unitTypes.includes(unitType as UnitType);
}

export default function IndicatorUnitSelector({ indicatorBoardMetadataId, indicatorId }: IndicatorUnitSelectorProps) {
  const { indicatorsUnitType, updateUnitType } = useIndicatorBoardMetadataViewModel(indicatorBoardMetadataId);

  const { unitType } = indicatorsUnitType?.find((indicator) => indicator.indicatorId === indicatorId) || {
    unitType: 'default',
  };

  console.log(indicatorsUnitType);
  const handleUnitTypeChange = (unitType: string) => {
    if (isUnitType(unitType)) {
      updateUnitType(indicatorBoardMetadataId, indicatorId, unitType);
    }
  };

  return (
    <Select value={unitType} onValueChange={handleUnitTypeChange}>
      <Select.Trigger className="w-18 h-7">
        <Select.Value placeholder="unit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>unit type</Select.Label>
          <Select.Item value="default">default</Select.Item>
          <Select.Item value="index">index</Select.Item>
          <Select.Item value="MoM">MoM</Select.Item>
          <Select.Item value="YoY">YoY</Select.Item>
          {/* <Select.Item>percent</Select.Item> */}
        </Select.Group>
      </Select.Content>
    </Select>
  );
}
