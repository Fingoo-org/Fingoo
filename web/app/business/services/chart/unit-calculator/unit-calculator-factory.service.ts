import { MoMUnitCalulator } from './MoM-unit-calculator.service';
import { YoYUnitCalulator } from './YOY-unit-calculator.service';
import { DefaultUnitCalculator } from './default-unit-calculator.service';
import { IndexUnitCalculator } from './index-unit-calculator.service';
import { UnitCalculator, ValueItem } from './unit-calculator.service';

export const unitTypes = ['YoY', 'MoM', 'index', 'default'] as const;

export type UnitType = (typeof unitTypes)[number];

export function createUnitCalculator(valueItems: ValueItem[], unitType: UnitType): UnitCalculator {
  switch (unitType) {
    case 'index':
      return new IndexUnitCalculator(valueItems);
    case 'MoM':
      return new MoMUnitCalulator(valueItems);
    case 'YoY':
      return new YoYUnitCalulator(valueItems);
    default:
      return new DefaultUnitCalculator(valueItems);
  }
}
