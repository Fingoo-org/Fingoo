import ToggleGroup from '../../view/molecule/toggle-group';

export default function DateRangeNavigator() {
  return (
    <ToggleGroup type={'single'} size={'xs'}>
      <ToggleGroup.Item value="1Y">1Y</ToggleGroup.Item>
      <ToggleGroup.Item value="5Y">5Y</ToggleGroup.Item>
      <ToggleGroup.Item value="10Y">10Y</ToggleGroup.Item>
      <ToggleGroup.Item value="MAX">MAX</ToggleGroup.Item>
    </ToggleGroup>
  );
}
