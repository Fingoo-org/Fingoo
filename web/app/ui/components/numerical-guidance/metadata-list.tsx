'use client';
import React from 'react';
import List from '../view/molocule/list';
import ListItem from '../view/atom/list-item';
import { useIndicatorMetadataList } from '@/app/hooks/use-indicator-metadata-list.hook';
import { IndicatorBoardMetadata } from '@/app/api/type/numerical-guidance.type';

export default React.memo(function MetadataList() {
  const { metadataList } = useIndicatorMetadataList();

  const renderItem = (item: IndicatorBoardMetadata) => <ListItem key={item.id}>{item.name}</ListItem>;

  return <div>{metadataList && <List list={metadataList} render={renderItem} />}</div>;
});
