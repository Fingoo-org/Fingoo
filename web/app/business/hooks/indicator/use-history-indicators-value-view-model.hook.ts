import { useFetchHistoryIndicatorValue } from '@/app/store/querys/numerical-guidance/history-indicator.query';

export const useHistoryIndicatorsValueViewModel = () => {
  const { data, size, setSize } = useFetchHistoryIndicatorValue(['9785ba85-c924-4269-8238-e1f10b404177']);

  console.log(data);

  // view 모델 변환
};
