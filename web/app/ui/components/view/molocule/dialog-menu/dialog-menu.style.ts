import { Size } from '@/app/utils/style';

type DialogMenuSizeType = {
  [key in Size]: string;
};

export const DialogMenuSize: DialogMenuSizeType = {
  xs: 'w-32',
  sm: 'w-40',
  md: 'w-52',
  lg: 'w-64',
  xl: 'w-72',
};
