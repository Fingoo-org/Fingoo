'use client';

import * as SelectPrimitive from '@radix-ui/react-select';
import { SelectContent } from './select-content';
import { SelectItem } from './select-item';
import { SelectLabel } from './select-label';
import { SelectSeparator } from './select-separator';
import { SelectTrigger } from './select-trigger';

const SelectRoot = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
  Label: SelectLabel,
  Separator: SelectSeparator,
  Trigger: SelectTrigger,
});

export default Select;
