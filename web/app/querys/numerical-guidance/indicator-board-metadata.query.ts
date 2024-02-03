import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { deleteFetcher, paramFetcher, updateFetcher } from '../fetcher';
import useSWRMutation from 'swr/mutation';

// Risk: 중복된 응답 타입을 가져가는게 옳은 선택일까? (2/2) 분리 했음
export type IndicatorResponse = {
  ticker: string;
  name: string;
};

export type IndicatorBoardMetadataResponse = {
  id: string;
  name: string;
  indicators: IndicatorResponse[];
};

export type IndicatorBoardMetadataListResponse = {
  metadataList: IndicatorBoardMetadataResponse[];
};

export type IndicatorRequestBody = {
  ticker: string;
  name: string;
};

export type CreateIndicatorMetadataRequestBody = {
  id: string;
  name: string;
  indicators: IndicatorRequestBody[];
};

export type AddIndicatorToMetadataRequestBody = {
  ticker: string;
  name: string;
};

export const useFetchIndicatorBoardMetadataList = () =>
  useSWR<IndicatorBoardMetadataListResponse>(API_PATH.metadataList);

export const useFetchMetadata = (metadataId: string | null) =>
  useSWR<IndicatorBoardMetadataResponse, any, [string, string] | null>(
    metadataId ? [API_PATH.metadata, metadataId] : null,
    ([url, metadataId]) => paramFetcher(url, metadataId),
  );

export const useCreateIndicatorMetadata = () =>
  useSWRMutation(API_PATH.metadataList, updateFetcher<CreateIndicatorMetadataRequestBody>);

export const useAddIndicatorToMetadata = (metadataId: string | null) =>
  useSWRMutation(metadataId ? [API_PATH.metadata, metadataId] : null, updateFetcher<AddIndicatorToMetadataRequestBody>);

export const useDeleteIndicatorFromMetadata = (metadataId: string | null) =>
  useSWRMutation(metadataId ? [API_PATH.metadata, metadataId] : null, deleteFetcher);
