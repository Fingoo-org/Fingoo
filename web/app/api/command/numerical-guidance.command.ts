import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { Indicator } from '../type/numerical-guidance.type';
import { updateFetcher } from '../fetcher';

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: Indicator[];
};

export const useCreateIndicatorMetadata = () =>
  useSWRMutation(API_PATH.metadataList, updateFetcher<CreateIndicatorMetadataRequestBody>);

export type AddIndicatorToMetadataRequestBody = {
  indicator: Indicator;
};

export const useAddIndicatorToMetadata = () =>
  useSWRMutation(API_PATH.metadataList, updateFetcher<AddIndicatorToMetadataRequestBody>);
