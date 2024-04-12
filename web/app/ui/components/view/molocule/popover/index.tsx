'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { PopoverContent } from './popover-content';
const PopoverRoot = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const Popover = Object.assign(PopoverRoot, {
  Content: PopoverContent,
  Trigger: PopoverTrigger,
});

export default Popover;
