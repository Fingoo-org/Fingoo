import Select from '../../../view/molecule/select';

export default function IndicatorUnitSelector() {
  return (
    <Select>
      <Select.Trigger className="w-18 h-7">
        <Select.Value placeholder="unit" />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>unit type</Select.Label>
          <Select.Item value="default">value</Select.Item>
          <Select.Item value="index">index</Select.Item>
          <Select.Item value="MoM">MoM</Select.Item>
          {/* <Select.Item>percent</Select.Item> */}
        </Select.Group>
      </Select.Content>
    </Select>
  );
}
