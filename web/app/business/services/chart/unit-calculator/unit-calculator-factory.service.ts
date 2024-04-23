import { MoMUnitCalulator } from './MoM-unit-calculator.service';
import { DefaultUnitCalculator } from './default-unit-calculator.service';
import { IndexUnitCalculator } from './index-unit-calculator.service';
import { UnitCalculator, ValueItem } from './unit-calculator.service';

export type UnitType = 'MoM' | 'index' | 'default';
export function createUnitCalculator(valueItems: ValueItem[], unitType: UnitType): UnitCalculator {
  switch (unitType) {
    case 'index':
      return new IndexUnitCalculator(valueItems);
    case 'MoM':
      return new MoMUnitCalulator(valueItems);
    default:
      return new DefaultUnitCalculator(valueItems);
  }
}