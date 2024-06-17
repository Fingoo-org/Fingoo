'use client';
import Tabs from '../../../components/view/molecule/tabs';
import IndicatorListContainer from './indicator-list-container';
import CustomForecastIndicatorListContainer from './custom-forecast-indicator-list-container';
import { useWorkspace } from '@/app/business/hooks/use-workspace.hook';
import { useSelectedIndicatorBoardMetadata } from '@/app/business/hooks/numerical-guidance/indicator-board-metedata/use-selected-indicator-board-metadata-view-model.hook';

export default function IndicatorBoardToolbar() {
  const { selectedMetadata } = useSelectedIndicatorBoardMetadata();
  const { tabIndex, setTabIndex } = useWorkspace();

  const handleTabValueChange = (value: string) => {
    setTabIndex(value);
  };

  const isMetadataSelected = !!selectedMetadata;

  return (
    <div>
      <Tabs
        className="mt-10 w-full"
        value={isMetadataSelected ? tabIndex : undefined}
        onValueChange={handleTabValueChange}
      >
        <Tabs.List className="grid h-10 w-full grid-cols-2">
          <Tabs.Trigger disabled={!isMetadataSelected} value="0">
            지표 추가
          </Tabs.Trigger>
          <Tabs.Trigger disabled={!isMetadataSelected} value="1">
            예측 지표
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="0">
          <IndicatorListContainer />
        </Tabs.Content>
        <Tabs.Content value="1">
          <CustomForecastIndicatorListContainer />
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
