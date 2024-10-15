import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/app/utils/style';

const alertVariants = cva(
  'flex items-center justify-center relative w-full rounded-lg bg-slate-200 px-4 py-2 text-sm  [&>svg]:text-slate-950 dark:bg-slate-800 dark:[&>svg]:text-slate-50',
  {
    variants: {
      variant: {
        default:
          'bg-fingoo-main text-white dark:bg-green-500 [&>svg]:text-white dark:border-green-900/50 dark:text-green-900 dark:dark:border-green-900 dark:[&>svg]:text-green-900',
        destructive:
          'bg-red-200/50 text-red-500 dark:bg-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:dark:border-red-900 dark:[&>svg]:text-red-900',
        warning:
          'bg-orange-200/50 text-orange-500 dark:bg-orange-500 [&>svg]:text-orange-500 dark:border-orange-900/50 dark:text-orange-900 dark:dark:border-orange-900 dark:[&>svg]:text-orange-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type CalloutProps = {
  icon?: React.ElementType;
  content?: string;
} & React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ className, variant, icon, content, children, ...props }, ref) => {
    const calloutContent = content || children;
    const Icon = icon;
    return (
      <div ref={ref} role="alert" className={cn('text-sm', alertVariants({ variant }), className)} {...props}>
        {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
        <div className='" [&_p]:leading-relaxed"'>{calloutContent}</div>
      </div>
    );
  },
);
Callout.displayName = 'Alert';

export default Callout;
