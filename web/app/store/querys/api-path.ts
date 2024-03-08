const API_URL =
  process.env.NEXT_PUBLIC_CODESPACES === 'true'
    ? 'https://' + process.env.NEXT_PUBLIC_CODESPACE_NAME + '-8000.app.github.dev/api'
    : 'http://localhost:8000/api';

export const API_PATH = {
  indicatorList: `${API_URL}/numerical-guidance/indicator`,
  indicatorBoardMetadata: `${API_URL}/numerical-guidance/indicator-board-metadata`,
  indicatorValue: `${API_URL}/numerical-guidance/indicators`,
  customForecastIndicator: `${API_URL}/numerical-guidance/custom-forecast-indicator`,
  historyIndicatorsValue: `${API_URL}/numerical-guidance/indicators/history`,
};
