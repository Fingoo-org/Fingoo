import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { Indicator } from '../type/numerical-guidance.type';
import { updateFetcher } from '../fetcher';
import { IndicatorResponse } from '../query/numerical-guidance.query';

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: Indicator[];
};

export const useCreateIndicatorMetadata = () =>
  useSWRMutation(API_PATH.metadataList, updateFetcher<CreateIndicatorMetadataRequestBody>);

// Risk: no mapping
export type AddIndicatorToMetadataRequestBody = IndicatorResponse;

export const useAddIndicatorToMetadata = (metadataId: string | null) =>
  useSWRMutation(metadataId ? [API_PATH.metadata, metadataId] : null, updateFetcher<AddIndicatorToMetadataRequestBody>);
