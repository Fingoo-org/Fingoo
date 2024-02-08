'use client';
import React from 'react';
import List from '../view/molocule/list';
import { useIndicatoBoardrMetadataList } from '@/app/business/hooks/use-indicator-board-metadata-list.hook';
import { IndicatorBoardMetadataResponse } from '@/app/store/querys/numerical-guidance/indicator-board-metadata.query';
import Button from '../../components/view/atom/button';
import Pending from '../view/molocule/pending';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/use-selected-indicator-board-metadata.hook';
import MetadataListItem from './metadata-list-item';

export default React.memo(function MetadataList() {
  const { metadataList, createMetadata, isPending } = useIndicatoBoardrMetadataList();
  const { selectMetadataById } = useSelectedIndicatorBoardMetadata();

  const handleMetadataCreateAndSelect = async () => {
    const metadata = {
      id: Math.random().toString(36),
      name: 'metadata1',
      indicators: [],
    };
    try {
      await createMetadata(metadata);
      selectMetadataById(metadata.id);
    } catch (e) {
      // error: 위에서 처리, 넘겨줄 필요 있나?
      throw e;
    }
  };

  const renderItem = (item: IndicatorBoardMetadataResponse) => <MetadataListItem item={item} />;

  return (
    <Pending isPending={isPending}>
      {metadataList && <List list={metadataList} render={renderItem} />}
      <Button onClick={handleMetadataCreateAndSelect}>create</Button>
    </Pending>
  );
});
