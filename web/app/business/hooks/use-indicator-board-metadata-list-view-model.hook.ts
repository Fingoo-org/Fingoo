import {
  CreateIndicatorMetadataRequestBody,
  useCreateIndicatorMetadata,
  useDeleteIndicatorBoardMetadata,
} from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useFetchIndicatorBoardMetadataList } from '../../store/querys/numerical-guidance/indicator-board-metadata.query';
import { useMemo, useRef } from 'react';
import {
  IndicatorBoardMetadata,
  convertIndcatorBoardMetadataList,
} from '../services/view-model/indicator-board-metadata-view-model.service';

export const useIndicatorBoardMetadataList = () => {
  const { data, isValidating } = useFetchIndicatorBoardMetadataList();
  const { trigger: deleteMetadataTrigger } = useDeleteIndicatorBoardMetadata();
  const { trigger: createMetadataTrigger, isMutating } = useCreateIndicatorMetadata();
  const isPending = useRef(false);

  if (isPending.current === false) {
    if (isMutating) {
      isPending.current = true;
    }
  } else {
    if (isValidating === false && isMutating === false) {
      isPending.current = false;
    }
  }

  const createMetadata = async (metadata: IndicatorBoardMetadata) => {
    try {
      await createMetadataTrigger(metadata.formattedIndicatorBoardMetadata);
    } catch {
      // error: 전역 에러 처리 or 에러 바운더리에서 처리
    }
  };

  const deleteMetadata = async (metadataId: string) => {
    deleteMetadataTrigger(metadataId, {
      optimisticData: () => {
        return {
          metadataList: data?.metadataList?.filter((metadata) => metadata.id !== metadataId),
        };
      },
      revalidate: false,
    });
  };

  // refactor: 위에 선언하는게 맞는가 아래에 선언하는게 맞는가? 무엇을 무엇으로부터 보호하는 것인가?
  const metadataList = useMemo(() => {
    if (!data) return undefined;

    return convertIndcatorBoardMetadataList(data);
  }, [data]);

  return {
    metadataList,
    isPending: isPending.current,
    createMetadata,
    deleteMetadata,
  };
};
