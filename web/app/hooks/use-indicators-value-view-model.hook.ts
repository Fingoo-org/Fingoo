import { useFetchIndicatorsValue } from '../api/query/numerical-guidance.query';
import { useSelectedIndicatorBoardMetadata } from './use-selected-indicator-board-metadata.hook';

export const useIndicatorsValueViewModel = () => {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { data } = useFetchIndicatorsValue(selectedMetadata?.indicators ?? []);

  console.log(data);
  return {
    indicatorsValue: data?.indicatorsValue,
  };
};
