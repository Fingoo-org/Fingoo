import { colorPalette, getColorClassNames } from '@/app/utils/style';
import { CustomTooltipProps } from '@tremor/react';
import { twMerge } from 'tailwind-merge';
import { Color } from '@/app/utils/style';

export type ValueFormatter = {
  (value: number): string;
};

export interface ChartTooltipRowProps {
  value: any;
  name: any;
  color: string;
}

export const ChartTooltipFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className={twMerge(
      // common
      'rounded-tremor-default border text-tremor-default',
      // light
      'border-tremor-border bg-tremor-background shadow-tremor-dropdown',
      // dark
      'dark:border-dark-tremor-border dark:bg-dark-tremor-background dark:shadow-dark-tremor-dropdown',
    )}
  >
    {children}
  </div>
);

export const ChartTooltipRow = ({ value, name, color }: ChartTooltipRowProps) => (
  <div className="flex items-center justify-between space-x-8">
    <div className="flex items-center space-x-2">
      <span
        className={twMerge(
          // common
          'h-3 w-3 shrink-0 rounded-tremor-full border-2',
          // light
          'border-tremor-background shadow-tremor-card',
          // dark
          'dark:border-dark-tremor-background dark:shadow-dark-tremor-card',
          color,
        )}
      />
      <p
        className={twMerge(
          // commmon
          'whitespace-nowrap text-right',
          // light
          'text-tremor-content',
          // dark
          'dark:text-dark-tremor-content',
        )}
      >
        {name}
      </p>
    </div>
    <p
      className={twMerge(
        // common
        'whitespace-nowrap text-right font-medium tabular-nums',
        // light
        'text-tremor-content-emphasis',
        // dark
        'dark:text-dark-tremor-content-emphasis',
      )}
    >
      {value}
    </p>
  </div>
);

export const ChartTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload) {
    const filteredPayload = payload.filter((item: any) => item.type !== 'none');
    return (
      <ChartTooltipFrame>
        <div
          className={twMerge(
            // light
            'border-b border-tremor-border px-4 py-2',
            // dark
            'dark:border-dark-tremor-border',
          )}
        >
          <p
            className={twMerge(
              // common
              'font-medium',
              // light
              'text-tremor-content-emphasis',
              // dark
              'dark:text-dark-tremor-content-emphasis',
            )}
          >
            {label}
          </p>
        </div>

        <div className={twMerge('space-y-1 px-4 py-2')}>
          {filteredPayload.map(({ payload, name, color }, idx: number) => (
            <ChartTooltipRow
              key={`id-${idx}`}
              value={payload.displayValue[name!]}
              name={name}
              color={`bg-${color}` ?? 'bg-black'}
            />
          ))}
        </div>
      </ChartTooltipFrame>
    );
  }
  return null;
};
