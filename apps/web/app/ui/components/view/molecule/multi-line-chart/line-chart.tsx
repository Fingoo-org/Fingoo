// tremor/react의 line chart를 커스터마이징하기 위해 가져옴

'use client';
import React, { Fragment, useState } from 'react';
import {
  CartesianGrid,
  Dot,
  Legend,
  Line,
  LineChart as ReChartsLineChart,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

import { LineChartProps } from '@tremor/react';
import ChartLegend from '@tremor/react/dist/components/chart-elements/common/ChartLegend';
import ChartTooltip from '@tremor/react/dist/components/chart-elements/common/ChartTooltip';
import NoData from '@tremor/react/dist/components/chart-elements/common/NoData';
import {
  constructCategoryColors,
  getYAxisDomain,
  hasOnlyOneValueForThisKey,
} from '@tremor/react/dist/components/chart-elements/common/utils';

import { BaseColors } from '@tremor/react/dist/lib/constants';
import { colorPalette, themeColorRange } from '@tremor/react/dist/lib/theme';
import { defaultValueFormatter, getColorClassNames } from '@tremor/react/dist/lib/utils';
import { tremorTwMerge } from '@tremor/react/dist/lib/tremorTwMerge';

import { getNowDate } from '@/app/utils/date-formatter';

interface ActiveDot {
  index?: number;
  dataKey?: string;
}

type ExtendedLineChartProps = LineChartProps & {
  autoNowDateReferenceLine?: boolean;
  syncId?: string;
  height?: number;
  showHighLowPoints?: boolean;
  customColors?: string[];
  customReferenceLine?: number;
};

const LineChart = React.forwardRef<HTMLDivElement, ExtendedLineChartProps>((props, ref) => {
  const {
    data = [],
    categories = [],
    index,
    colors = themeColorRange,
    valueFormatter = defaultValueFormatter,
    startEndOnly = false,
    showXAxis = true,
    showYAxis = true,
    yAxisWidth = 56,
    intervalType = 'equidistantPreserveStart',
    animationDuration = 900,
    showAnimation = false,
    showTooltip = true,
    showLegend = true,
    showGridLines = true,
    autoMinValue = false,
    curveType = 'linear',
    minValue,
    maxValue,
    connectNulls = false,
    allowDecimals = true,
    noDataText,
    className,
    onValueChange,
    enableLegendSlider = false,
    customTooltip,
    rotateLabelX,
    tickGap = 5,
    autoNowDateReferenceLine = true,
    syncId,
    height = 320,
    showHighLowPoints = false,
    customColors,
    customReferenceLine,
    ...other
  } = props;
  const CustomTooltip = customTooltip;
  const paddingValue = !showXAxis && !showYAxis ? 0 : 20;
  const [legendHeight, setLegendHeight] = useState(60);
  const [activeDot, setActiveDot] = useState<ActiveDot | undefined>(undefined);
  const [activeLegend, setActiveLegend] = useState<string | undefined>(undefined);

  const categoryColors = constructCategoryColors(
    categories,
    customColors && customColors.length > 0 ? customColors : colors,
  );

  const yAxisDomain = getYAxisDomain(autoMinValue, minValue, maxValue);
  const hasOnValueChange = !!onValueChange;

  const nowDate = autoNowDateReferenceLine ? getNowDate() : undefined;

  const highPoint = data.length > 0 ? Math.max(...data.map((d: any) => d[categories[0]])) : null;
  const lowPoint = data.length > 0 ? Math.min(...data.map((d: any) => d[categories[0]])) : null;

  function onDotClick(itemData: any, event: React.MouseEvent) {
    event.stopPropagation();

    if (!hasOnValueChange) return;
    if (
      (itemData.index === activeDot?.index && itemData.dataKey === activeDot?.dataKey) ||
      (hasOnlyOneValueForThisKey(data, itemData.dataKey) && activeLegend && activeLegend === itemData.dataKey)
    ) {
      setActiveLegend(undefined);
      setActiveDot(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(itemData.dataKey);
      setActiveDot({
        index: itemData.index,
        dataKey: itemData.dataKey,
      });
      onValueChange?.({
        eventType: 'dot',
        categoryClicked: itemData.dataKey,
        ...itemData.payload,
      });
    }
  }

  function onCategoryClick(dataKey: string) {
    if (!hasOnValueChange) return;
    if (
      (dataKey === activeLegend && !activeDot) ||
      (hasOnlyOneValueForThisKey(data, dataKey) && activeDot && activeDot.dataKey === dataKey)
    ) {
      setActiveLegend(undefined);
      onValueChange?.(null);
    } else {
      setActiveLegend(dataKey);
      onValueChange?.({
        eventType: 'category',
        categoryClicked: dataKey,
      });
    }
    setActiveDot(undefined);
  }

  return (
    <div
      ref={ref}
      style={{
        height: height,
      }}
      className={tremorTwMerge('w-full', className)}
      {...other}
    >
      <ResponsiveContainer className="h-full w-full">
        {data?.length ? (
          <ReChartsLineChart
            syncId={syncId}
            width={300}
            height={300}
            data={data}
            onClick={
              hasOnValueChange && (activeLegend || activeDot)
                ? () => {
                    setActiveDot(undefined);
                    setActiveLegend(undefined);
                    onValueChange?.(null);
                  }
                : undefined
            }
          >
            {nowDate ? <ReferenceLine strokeWidth={2} label="예측 지표" x={nowDate} /> : null}
            {showGridLines ? (
              <CartesianGrid
                className={tremorTwMerge(
                  // common
                  'stroke-1',
                  // light
                  'stroke-tremor-border',
                  // dark
                  'dark:stroke-dark-tremor-border',
                )}
                horizontal={true}
                vertical={false}
              />
            ) : null}
            <XAxis
              padding={{ left: paddingValue, right: paddingValue }}
              hide={!showXAxis}
              dataKey={index}
              interval={startEndOnly ? 'preserveStartEnd' : intervalType}
              tick={{ transform: 'translate(0, 6)' }}
              ticks={startEndOnly ? [data[0][index], data[data.length - 1][index]] : undefined}
              fill=""
              stroke=""
              className={tremorTwMerge(
                // common
                'text-tremor-label',
                // light
                'fill-tremor-content',
                // dark
                'dark:fill-dark-tremor-content',
              )}
              tickLine={false}
              axisLine={false}
              minTickGap={tickGap}
              angle={rotateLabelX?.angle}
              dy={rotateLabelX?.verticalShift}
              height={rotateLabelX?.xAxisHeight}
            />
            <YAxis
              width={yAxisWidth}
              hide={!showYAxis}
              axisLine={false}
              tickLine={false}
              type="number"
              domain={yAxisDomain as AxisDomain}
              tick={{ transform: 'translate(-3, 0)' }}
              fill=""
              stroke=""
              className={tremorTwMerge(
                // common
                'text-tremor-label',
                // light
                'fill-tremor-content',
                // dark
                'dark:fill-dark-tremor-content',
              )}
              tickFormatter={valueFormatter}
              allowDecimals={allowDecimals}
            />
            <Tooltip
              wrapperStyle={{ outline: 'none' }}
              isAnimationActive={false}
              cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
              content={
                showTooltip ? (
                  ({ active, payload, label }) =>
                    CustomTooltip ? (
                      <CustomTooltip
                        payload={payload?.map((payloadItem: any) => ({
                          ...payloadItem,
                          color: categoryColors.get(payloadItem.dataKey) ?? BaseColors.Gray,
                        }))}
                        active={active}
                        label={label}
                      />
                    ) : (
                      <ChartTooltip
                        active={active}
                        payload={payload}
                        label={label}
                        valueFormatter={valueFormatter}
                        categoryColors={categoryColors}
                      />
                    )
                ) : (
                  <></>
                )
              }
              position={{ y: 0 }}
            />

            {showLegend ? (
              <Legend
                verticalAlign="top"
                height={legendHeight}
                content={({ payload }) =>
                  ChartLegend(
                    { payload },
                    categoryColors,
                    setLegendHeight,
                    activeLegend,
                    hasOnValueChange ? (clickedLegendItem: string) => onCategoryClick(clickedLegendItem) : undefined,
                    enableLegendSlider,
                  )
                }
              />
            ) : null}
            {categories.map((category) => (
              <Line
                className={tremorTwMerge(
                  getColorClassNames(categoryColors.get(category) ?? BaseColors.Gray, colorPalette.text).strokeColor,
                )}
                strokeOpacity={activeDot || (activeLegend && activeLegend !== category) ? 0.3 : 1}
                activeDot={(props: any) => {
                  const { cx, cy, stroke, strokeLinecap, strokeLinejoin, strokeWidth, dataKey } = props;
                  return (
                    <Dot
                      className={tremorTwMerge(
                        'stroke-tremor-background dark:stroke-dark-tremor-background',
                        onValueChange ? 'cursor-pointer' : '',
                        getColorClassNames(categoryColors.get(dataKey) ?? BaseColors.Gray, colorPalette.text).fillColor,
                      )}
                      cx={cx}
                      cy={cy}
                      r={5}
                      fill=""
                      stroke={stroke}
                      strokeLinecap={strokeLinecap}
                      strokeLinejoin={strokeLinejoin}
                      strokeWidth={strokeWidth}
                      onClick={(dotProps: any, event) => onDotClick(props, event)}
                    />
                  );
                }}
                dot={(props: any) => {
                  const { stroke, strokeLinecap, strokeLinejoin, strokeWidth, cx, cy, dataKey, index, payload } = props;

                  const value = payload[dataKey];

                  if (showHighLowPoints && (parseFloat(value) === highPoint || parseFloat(value) === lowPoint)) {
                    return (
                      <Fragment key={index}>
                        <Dot
                          cx={cx}
                          cy={cy}
                          r={5}
                          stroke={stroke}
                          fill={stroke}
                          strokeLinecap={strokeLinecap}
                          strokeLinejoin={strokeLinejoin}
                          strokeWidth={strokeWidth}
                          className={tremorTwMerge(
                            'stroke-tremor-background dark:stroke-dark-tremor-background',
                            onValueChange ? 'cursor-pointer' : '',
                            getColorClassNames(categoryColors.get(dataKey) ?? BaseColors.Gray, colorPalette.text)
                              .fillColor,
                          )}
                        />
                        <text
                          x={cx}
                          y={parseFloat(value) === highPoint ? cy - 10 : cy + 20}
                          textAnchor="middle"
                          fontSize="12"
                          fill={stroke}
                        >
                          {value}
                        </text>
                      </Fragment>
                    );
                  }

                  if (
                    (hasOnlyOneValueForThisKey(data, category) &&
                      !(activeDot || (activeLegend && activeLegend !== category))) ||
                    (activeDot?.index === index && activeDot?.dataKey === category)
                  ) {
                    return (
                      <Dot
                        key={index}
                        cx={cx}
                        cy={cy}
                        r={5}
                        stroke={stroke}
                        fill=""
                        strokeLinecap={strokeLinecap}
                        strokeLinejoin={strokeLinejoin}
                        strokeWidth={strokeWidth}
                        className={tremorTwMerge(
                          'stroke-tremor-background dark:stroke-dark-tremor-background',
                          onValueChange ? 'cursor-pointer' : '',
                          getColorClassNames(categoryColors.get(dataKey) ?? BaseColors.Gray, colorPalette.text)
                            .fillColor,
                        )}
                      />
                    );
                  }
                  return <Fragment key={index}></Fragment>;
                }}
                key={category}
                name={category}
                type={curveType}
                dataKey={category}
                stroke=""
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
                isAnimationActive={showAnimation}
                animationDuration={animationDuration}
                connectNulls={connectNulls}
              />
            ))}
            {onValueChange
              ? categories.map((category) => (
                  <Line
                    className={tremorTwMerge('cursor-pointer')}
                    strokeOpacity={0}
                    key={category}
                    name={category}
                    type={curveType}
                    dataKey={category}
                    stroke="transparent"
                    fill="transparent"
                    legendType="none"
                    tooltipType="none"
                    strokeWidth={12}
                    connectNulls={connectNulls}
                    onClick={(props: any, event) => {
                      event.stopPropagation();
                      const { name } = props;
                      onCategoryClick(name);
                    }}
                  />
                ))
              : null}
            {customReferenceLine !== undefined && (
              <ReferenceLine
                y={customReferenceLine}
                stroke={BaseColors.Gray}
                strokeDasharray="3 3" // 점선
                strokeWidth={1}
              />
            )}
          </ReChartsLineChart>
        ) : (
          <NoData noDataText={noDataText} />
        )}
      </ResponsiveContainer>
    </div>
  );
});

LineChart.displayName = 'LineChart';

export default LineChart;
