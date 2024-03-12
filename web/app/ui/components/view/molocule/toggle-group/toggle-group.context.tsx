import { type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { toggleVariants } from './toggle-group-root';

export const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: 'default',
  variant: 'default',
});
