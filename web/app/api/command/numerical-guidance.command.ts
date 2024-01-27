import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { Indicator } from '../type/numerical-guidance.type';
import axios from 'axios';

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: Indicator[];
};

// 추상화 할 수 있을까?
async function createIndicatorMetadata(url: string, { arg }: { arg: CreateIndicatorMetadataRequestBody }) {
  try {
    await axios.post(url, arg);
  } catch (e) {
    throw e;
  }
}

export const useCreateIndicatorMetadata = () => {
  const { trigger, error } = useSWRMutation(API_PATH.metadataList, createIndicatorMetadata);
  return {
    trigger,
    mutationError: error,
  };
};
