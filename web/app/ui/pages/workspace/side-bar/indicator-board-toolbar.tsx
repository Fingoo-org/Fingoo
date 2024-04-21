'use client';
import Tabs from '../../../components/view/molecule/tabs';
import MetadataListContainer from './metadata-list-container';
import IndicatorListContainer from './indicator-list-container';
import CustomForecastIndicatorListContainer from './custom-forecast-indicator-list-container';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';
import { useWorkspace } from '@/app/business/hooks/use-workspace.hook';

export default function IndicatorBoardToolbar() {
  const { selectedMetadataId } = useSelectedIndicatorBoardMetadata();
  const { tabIndex, setTabIndex } = useWorkspace();

  const handleTabValueChange = (value: string) => {
    setTabIndex(value);
  };

  return (
    <div>
      <Tabs className="w-full px-2" value={tabIndex} onValueChange={handleTabValueChange}>
        <Tabs.List className="grid h-10 w-full grid-cols-3">
          <Tabs.Trigger disabled={selectedMetadataId ? false : true} value="0">
            지표 추가
          </Tabs.Trigger>
          <Tabs.Trigger disabled={selectedMetadataId ? false : true} value="1">
            예측 지표
          </Tabs.Trigger>
          <Tabs.Trigger value="2"> 메타 데이터</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="0">
          <IndicatorListContainer />
        </Tabs.Content>
        <Tabs.Content value="1">
          <CustomForecastIndicatorListContainer />
        </Tabs.Content>
        <Tabs.Content value="2">
          <MetadataListContainer />
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
