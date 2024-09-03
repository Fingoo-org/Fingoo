import { delay } from 'msw';
import { customForecastIndicatorHandlers } from './custom-forecast-indicator-handler.mock';
import { indicatorHandlers } from './indicator-handler.mock';
import { indicatorBoardMetadataHandlers } from './indicator-board-metadata-handler.mock';
import { majorChartHandlers } from './major-chart-handler.mock';

export const delayForDevelopment = async (ms = 1000) => {
  if (process.env.NODE_ENV === 'development') {
    await delay(ms);
  }
};

export const handlers = [
  ...indicatorBoardMetadataHandlers,
  ...customForecastIndicatorHandlers,
  ...indicatorHandlers,
  ...majorChartHandlers,
];
