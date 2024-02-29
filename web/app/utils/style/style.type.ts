const colorValues = [
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'white',
] as const;

export type Color = (typeof colorValues)[number];
export type CustomColor = Color | string;
export const getIsBaseColor = (color: Color | string) => colorValues.includes(color as Color);
const sizeValues = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export type Size = (typeof sizeValues)[number];

const iconVariantValues = ['simple', 'outlined'] as const;

export type IconVariant = (typeof iconVariantValues)[number];

const buttonVariantValues = ['primary', 'secondary', 'light'] as const;

export type ButtonVariant = (typeof buttonVariantValues)[number];
