'use client';
import React from 'react';
import { Area, AreaChart as ReChartsAreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { BaseColors } from '@tremor/react/dist/lib/constants';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';

import { CurveType } from '@tremor/react/dist/lib/inputTypes';

import { constructCategoryColors, getYAxisDomain } from '@tremor/react/dist/components/chart-elements/common/utils';
import { AxisDomain } from 'recharts/types/util/types';
import NoData from '@tremor/react/dist/components/chart-elements/common/NoData';
import { Color } from '@tremor/react';

interface BaseAnimationTimingProps {
  animationDuration?: number;
  showAnimation?: boolean;
}

interface BaseSparkChartProps extends BaseAnimationTimingProps, React.HTMLAttributes<HTMLDivElement> {
  data: any[];
  categories: string[];
  index: string;
  colors?: (Color | string)[];
  noDataText?: string;
  autoMinValue?: boolean;
  minValue?: number;
  maxValue?: number;
}

export interface SparkAreaChartProps extends BaseSparkChartProps {
  stack?: boolean;
  curveType?: CurveType;
  connectNulls?: boolean;
  showGradient?: boolean;
}

const SparkAreaChart = React.forwardRef<HTMLDivElement, SparkAreaChartProps>((props, ref) => {
  const {
    data = [],
    categories = [],
    index,
    stack = false,
    colors = themeColorRange,
    showAnimation = false,
    animationDuration = 900,
    showGradient = true,
    curveType = 'linear',
    connectNulls = false,
    noDataText,
    autoMinValue = false,
    minValue,
    maxValue,
    className,
    ...other
  } = props;
  const categoryColors = constructCategoryColors(categories, colors);
  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);

  return (
    <div ref={ref} className={tremorTwMerge('h-12 w-28', className)} {...other}>
      <ResponsiveContainer className="h-full w-full">
        {data?.length ? (
          <ReChartsAreaChart data={data} margin={{ top: 1, left: 1, right: 1, bottom: 1 }}>
            <YAxis hide domain={yAxisDomain as AxisDomain} />
            <XAxis hide dataKey={index} />
            {categories.map((category) => {
              return (
                <defs key={category}>
                  {showGradient ? (
                    <linearGradient
                      className={
                        getColorClassNames(categoryColors.get(category) ?? BaseColors.Gray, colorPalette.text).textColor
                      }
                      id={categoryColors.get(category)}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="currentColor" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="currentColor" stopOpacity={0} />
                    </linearGradient>
                  ) : (
                    <linearGradient
                      className={
                        getColorClassNames(categoryColors.get(category) ?? BaseColors.Gray, colorPalette.text).textColor
                      }
                      id={categoryColors.get(category)}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop stopColor="currentColor" stopOpacity={0.3} />
                    </linearGradient>
                  )}
                </defs>
              );
            })}
            {categories.map((category) => (
              <Area
                className={
                  getColorClassNames(categoryColors.get(category) ?? BaseColors.Gray, colorPalette.text).strokeColor
                }
                strokeOpacity={1}
                dot={false}
                key={category}
                name={category}
                type={curveType}
                dataKey={category}
                stroke=""
                fill={`url(#${categoryColors.get(category)})`}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                isAnimationActive={showAnimation}
                animationDuration={animationDuration}
                stackId={stack ? 'a' : undefined}
                connectNulls={connectNulls}
              />
            ))}
          </ReChartsAreaChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </div>
  );
});

SparkAreaChart.displayName = 'SparkAreaChart';

export default SparkAreaChart;
