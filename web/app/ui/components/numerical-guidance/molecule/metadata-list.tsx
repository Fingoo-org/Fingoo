'use client';
import React from 'react';
import List from '../../view/molocule/list';
import { useIndicatorBoardMetadataList } from '@/app/business/hooks/use-indicator-board-metadata-list.hook';
import Button from '../../view/atom/button/button';
import Pending from '../../view/molocule/pending';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import MetadataListItem from '../atom/metadata-list-item';
import { IndicatorBoardMetadata } from '@/app/business/services/view-model/indicator-board-metadata-view-model.service';

const MetdataList = React.memo(function MetadataList() {
  const { metadataList, createMetadata, isPending } = useIndicatorBoardMetadataList();
  const { selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const handleMetadataCreateAndSelect = async () => {
    const metadata = {
      id: Math.random().toString(36),
      name: 'metadata1',
      tickers: [],
    };
    try {
      await createMetadata(new IndicatorBoardMetadata(metadata));
      selectMetadataById(metadata.id);
    } catch (e) {
      // error: 위에서 처리, 넘겨줄 필요 있나?
      throw e;
    }
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

export default MetdataList;
