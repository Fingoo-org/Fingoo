'use client';
import React from 'react';
import List from '../view/molocule/list';
import ListItem from '../view/atom/list-item';
import { useIndicatoBoardrMetadataList } from '@/app/hooks/use-indicator-board-metadata-list.hook';
import { IndicatorBoardMetadataResponse } from '@/app/api/query/numerical-guidance.query';

export default React.memo(function MetadataList() {
  const { metadataList } = useIndicatoBoardrMetadataList();

  const renderItem = (item: IndicatorBoardMetadataResponse) => <ListItem key={item.id}>{item.name}</ListItem>;

  return <div>{metadataList && <List list={metadataList} render={renderItem} />}</div>;
});
