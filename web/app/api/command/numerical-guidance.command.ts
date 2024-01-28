import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { Indicator } from '../type/numerical-guidance.type';
import { updateFetcher } from '../fetcher';

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: Indicator[];
};

export const useCreateIndicatorMetadata = () => {
  const { trigger, error } = useSWRMutation(API_PATH.metadataList, updateFetcher<CreateIndicatorMetadataRequestBody>);
  return {
    trigger,
    mutationError: error,
  };
};
