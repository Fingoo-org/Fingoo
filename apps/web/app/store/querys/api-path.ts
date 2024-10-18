const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_CODESPACES === 'true'
      ? 'https://' + process.env.NEXT_PUBLIC_CODESPACE_NAME + '-8000.app.github.dev/api'
      : 'http://localhost:8000/api';

export const API_PATH = {
  auth: `${API_URL}/auth`,
  indicatorList: `${API_URL}/numerical-guidance/indicator`,
  indicatorBoardMetadata: `${API_URL}/numerical-guidance/indicator-board-metadata`,
  liveIndicatorValue: `${API_URL}/numerical-guidance/indicators/live`, // refactor: be 수정되면 k-stock 사라져야함
  customForecastIndicator: `${API_URL}/numerical-guidance/custom-forecast-indicator`,
  historyIndicatorsValue: `${API_URL}/numerical-guidance/indicators/history`,
  indicatorQuote: `${API_URL}/numerical-guidance/indicators/quote`,
  majorChart: `${API_URL}/major-chart`,
  postList: `${API_URL}/community/post`,
  pathchHeart: `${API_URL}/community/like`,
};
