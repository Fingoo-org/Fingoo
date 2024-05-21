'use client';
import React from 'react';
import List from '../../../view/molecule/list';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import Button from '../../../view/atom/button/button';
import Pending from '../../../view/molecule/pending';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import MetadataListItem from '../metadata-list-item/metadata-list-item';
import { IndicatorBoardMetadata } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-view-model.service';
import { PlusIcon } from '@heroicons/react/solid';

const MetadataList = React.memo(function MetadataList() {
  const { metadataList, createIndicatorBoardMetadata, isPending } = useIndicatorBoardMetadataList();
  const { selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const handleMetadataCreateAndSelect = async () => {
    const metadata = {
      indicatorBoardMetadataName: 'metadata1',
    };

    const indicatorBoardMetadataId = await createIndicatorBoardMetadata(metadata);

    // selectMetadataById(indicatorBoardMetadataId);
  };

  const renderItem = (item: IndicatorBoardMetadata) => <MetadataListItem key={item.id} item={item} />;

  return (
    <Pending isPending={isPending}>
      <div className="flex justify-end py-2 pb-3 pr-2">
        <Button
          color={'slate'}
          variant={'light'}
          className="rounded-lg bg-fingoo-gray-1.5 px-2 py-1 text-fingoo-gray-5"
          onClick={handleMetadataCreateAndSelect}
        >
          <PlusIcon className="h-4 w-4 pr-1 font-semibold" />
          메타데이터 추가
        </Button>
      </div>
      <div data-testid="metadata-list" className=" h-[26vh] overflow-y-auto px-3 pt-1 scrollbar-thin">
        {metadataList ? <List list={metadataList} render={renderItem} /> : null}
      </div>
    </Pending>
  );
});

export default MetadataList;
