import useSWRMutation from 'swr/mutation';
import { API_PATH } from '../constants/api-path';
import { Indicator } from '@/app/store/indicator-board-metadata.slice';
import { ResponseIndicatorBoardMetadata } from '../query/numerical-guidance.query';

type RequestCreateIndicatorMetadataBody = {
  id: string;
  name: string;
  indicators: Indicator[];
};

async function createIndicatorMetadata(url: string, { arg }: { arg: RequestCreateIndicatorMetadataBody }) {
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.');
    // axios로 전환 후 인터셉트로 error 서브클래싱 처리 필요
    throw error;
  }
}

export const useCreateIndicatorMetadata = () => {
  const { trigger, error } = useSWRMutation(API_PATH.metadataList, createIndicatorMetadata);
  return {
    trigger,
    mutationError: error,
  };
};
