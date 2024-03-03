// refactor: cors 설정에 맞춰서 변경 필요
const API_URL = 'https://symmetrical-giggle-vqxr9w77xr6f4qr-8000.app.github.dev/api';

export const API_PATH = {
  indicatorList: `${API_URL}/indicator-list`,
  indicatorBoardMetadata: `${API_URL}/indicator-board-metadata`,
  indicatorValue: `${API_URL}/numerical-guidance/indicators`,
  customForecastIndicator: `${API_URL}/numerical-guidance/custom-forecast-indicator`,
  historyIndicatorsValue: `${API_URL}/numerical-guidance/indicators/history`,
};
