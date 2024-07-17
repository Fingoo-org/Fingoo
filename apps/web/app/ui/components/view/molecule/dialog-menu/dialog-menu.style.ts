import { Size } from '@/app/utils/style';

const expandedDialogMenusizeValues = ['2xl', '3xl'] as const;

type ExpandedSize = (typeof expandedDialogMenusizeValues)[number];

export type DialogMenuSize = Size | ExpandedSize;

type DialogMenuSizeType = {
  [key in DialogMenuSize]: string;
};

export const dialogMenuSize: DialogMenuSizeType = {
  xs: 'w-32',
  sm: 'w-40',
  md: 'w-52',
  lg: 'w-64',
  xl: 'w-72',
  '2xl': 'w-80',
  '3xl': 'w-96',
};
