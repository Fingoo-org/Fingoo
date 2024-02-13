import useSWR from 'swr';
import { API_PATH } from '../api-path';
import { defaultFetcher, deleteFetcher, updateFetcher } from '../fetcher';
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
  useSWR<IndicatorBoardMetadataListResponse>(API_PATH.indicatorBoardMetadata, defaultFetcher);

export const useCreateIndicatorMetadata = () =>
  useSWRMutation(API_PATH.indicatorBoardMetadata, updateFetcher<CreateIndicatorMetadataRequestBody>);

export const useAddIndicatorToMetadata = (metadataId: string | null) =>
  useSWRMutation(
    API_PATH.indicatorBoardMetadata,
    async (url: string, { arg }: { arg: AddIndicatorToMetadataRequestBody }) => {
      await updateFetcher<AddIndicatorToMetadataRequestBody>(
        metadataId ? [url, metadataId] : API_PATH.indicatorBoardMetadata,
        {
          arg,
        },
      );
    },
  );

export const useDeleteIndicatorFromMetadata = (metadataId: string | null) =>
  useSWRMutation(API_PATH.indicatorBoardMetadata, async (url, { arg }: { arg: string }) => {
    await deleteFetcher(metadataId ? [url, metadataId] : API_PATH.indicatorBoardMetadata, { arg });
  });
