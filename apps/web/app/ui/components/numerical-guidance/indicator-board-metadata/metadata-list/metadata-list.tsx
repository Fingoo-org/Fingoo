'use client';
import React from 'react';
import List from '../../../view/molecule/list';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import Pending from '../../../view/molecule/pending';
import MetadataListItem from '../metadata-list-item/metadata-list-item';
import { IndicatorBoardMetadata } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-view-model.service';
import MetadataCreateButton from './metadata-create-button';

const MetadataList = React.memo(function MetadataList() {
  const { metadataList, isPending } = useIndicatorBoardMetadataList();

  const renderItem = (item: IndicatorBoardMetadata) => <MetadataListItem key={item.id} item={item} />;

  return (
    <Pending isPending={isPending}>
      <div className="flex justify-end py-2 pb-3 pr-2">
        <MetadataCreateButton />
      </div>
      <div data-testid="metadata-list" className=" h-[26vh] overflow-y-auto px-3 pt-1 scrollbar-thin">
        {metadataList ? <List list={metadataList} render={renderItem} /> : null}
      </div>
    </Pending>
  );
});

export default MetadataList;
