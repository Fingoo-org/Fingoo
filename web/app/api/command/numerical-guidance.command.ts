import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../api-path';
import { deleteFetcher, updateFetcher } from '../fetcher';

export type IndicatorRequestBody = {
  ticker: string;
  name: string;
};

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: IndicatorRequestBody[];
};

export const useCreateIndicatorMetadata = () =>
  useSWRMutation(API_PATH.metadataList, updateFetcher<CreateIndicatorMetadataRequestBody>);

export type AddIndicatorToMetadataRequestBody = {
  ticker: string;
  name: string;
};

export const useAddIndicatorToMetadata = (metadataId: string | null) =>
  useSWRMutation(metadataId ? [API_PATH.metadata, metadataId] : null, updateFetcher<AddIndicatorToMetadataRequestBody>);

export type DeleteIndicatorToMetadataRequestBody = {
  ticker: string;
  name: string;
};

export const useDeleteIndicatorFromMetadata = (metadataId: string | null) =>
  useSWRMutation(metadataId ? [API_PATH.metadata, metadataId] : null, deleteFetcher);
