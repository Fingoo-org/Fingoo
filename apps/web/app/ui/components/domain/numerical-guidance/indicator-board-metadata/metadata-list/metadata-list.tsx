'use client';
import React from 'react';
import List from '../../../../view/molecule/list';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import Pending from '../../../../view/molecule/pending';
import MetadataListItem from '../metadata-list-item/metadata-list-item';
import { IndicatorBoardMetadata } from '@/app/business/services/numerical-guidance/view-model/indicator-board-metadata/indicator-board-metadata-view-model.service';
import MetadataCreateButton from './metadata-create-button';
import ScrollArea from '@/app/ui/components/view/atom/scroll-area';

const MetadataList = React.memo(function MetadataList() {
  const { metadataList, isPending } = useIndicatorBoardMetadataList();

  const renderItem = (item: IndicatorBoardMetadata) => <MetadataListItem key={item.id} item={item} />;

  return (
    <Pending isPending={isPending}>
      <ScrollArea data-testid="metadata-list" className="h-[26vh]  ">
        <div className="px-2.5 pb-0.5 pt-3">
          {metadataList ? <List list={metadataList} render={renderItem} /> : null}
        </div>
      </ScrollArea>
    </Pending>
  );
});

export default MetadataList;
