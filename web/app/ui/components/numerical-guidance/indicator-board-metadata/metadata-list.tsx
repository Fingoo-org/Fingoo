'use client';
import React from 'react';
import List from '../../view/molocule/list';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/indicator-board-metedata/use-indicator-board-metadata-list-view-model.hook';
import Button from '../../view/atom/button/button';
import Pending from '../../view/molocule/pending';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import MetadataListItem from './metadata-list-item';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';

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
      {metadataList ? <List list={metadataList} render={renderItem} /> : null}
      <Button color={'blue'} onClick={handleMetadataCreateAndSelect}>
        create
      </Button>
    </Pending>
  );
});

export default MetadataList;
