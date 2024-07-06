'use client';
import React from 'react';
import {
  Line,
  Area,
  ReferenceArea,
  ComposedChart as ReChartsComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

import { BaseColors } from '@tremor/react/dist/lib/constants';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { getColorClassNames } from '@tremor/react/dist/lib/utils';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';

import { CurveType } from '@tremor/react/dist/lib/inputTypes';

import { constructCategoryColors, getYAxisDomain } from '@tremor/react/dist/components/chart-elements/common/utils';
import { AxisDomain } from 'recharts/types/util/types';
import NoData from '@tremor/react/dist/components/chart-elements/common/NoData';
import { Color } from '@tremor/react';
import { FormattedRowType } from '@/app/business/services/numerical-guidance/chart/indicator-formatter.service';
import { formatChartData } from '@/app/utils/tremor/chart-data-formatter';
import { calculateDateAfter, getNowDate } from '@/app/utils/date-formatter';

interface BaseAnimationTimingProps {
  animationDuration?: number;
  showAnimation?: boolean;
}

interface BaseSparkChartProps extends BaseAnimationTimingProps, React.HTMLAttributes<HTMLDivElement> {
  data: FormattedRowType[];
  index: string;
  colors?: (Color | string)[];
  noDataText?: string;
  autoMinValue?: boolean;
  minValue?: number;
  maxValue?: number;
  areaChartCategories: string[];
  lineChartCategories: string[];
}

export interface SparkChartProps extends BaseSparkChartProps {
  stack?: boolean;
  curveType?: CurveType;
  connectNulls?: boolean;
  showGradient?: boolean;
  autoReferenceArea?: boolean;
}

const SparkChart = React.forwardRef<HTMLDivElement, SparkChartProps>((props, ref) => {
  const {
    data = [],
    areaChartCategories = [],
    lineChartCategories = [],
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
    autoReferenceArea = false,
    ...other
  } = props;
  const categories = [...areaChartCategories, ...lineChartCategories];
  const categoryColors = constructCategoryColors(categories, colors);
  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);

  const formattedData = formatChartData(data, categories);

  return (
    <div ref={ref} className={tremorTwMerge('h-12 w-28', className)} {...other}>
      <ResponsiveContainer className="h-full w-full">
        {formattedData?.length ? (
          <ReChartsComposedChart data={formattedData} margin={{ top: 1, left: 1, right: 1, bottom: 1 }}>
            {autoReferenceArea ? <ReferenceArea x1={getNowDate()} /> : null}
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
            {areaChartCategories.map((category) => (
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
            {lineChartCategories.map((category) => (
              <Line
                className={tremorTwMerge(
                  getColorClassNames(categoryColors.get(category) ?? BaseColors.Gray, colorPalette.text).strokeColor,
                )}
                strokeOpacity={1}
                dot={false}
                key={category}
                name={category}
                type={curveType}
                dataKey={category}
                stroke=""
                strokeDasharray="4 4"
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                isAnimationActive={showAnimation}
                animationDuration={animationDuration}
                connectNulls={connectNulls}
              />
            ))}
          </ReChartsComposedChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </div>
  );
});

SparkChart.displayName = 'SparkChart';

export default SparkChart;
