import { cn } from '@/app/utils/style';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

const avatarVariants = cva(`object-cover`, {
  variants: {
    variant: {
      default: `rounded-full w-6 h-6`,
      square: ` w-6 h-6 object-fill`,
      big_circle: `rounded-full w-12 h-12`,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AvatarProps extends React.HTMLAttributes<HTMLImageElement>, VariantProps<typeof avatarVariants> {
  src: string; //커밋할때 삭제하기 src-> image로 교체
  image?: React.ReactNode;
}

export default function Avatar({ className, variant, src, ...props }: AvatarProps) {
  return <img className={cn(avatarVariants({ variant }), className)} src={src} {...props} />;
}
