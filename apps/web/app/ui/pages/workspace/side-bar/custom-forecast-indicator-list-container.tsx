import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../../components/util/client-data-suspense';
import CustomForecastIndicatorList from '../../../components/numerical-guidance/custom-forecast-indicator/custom-forecast-indicator-list/custom-forecast-indicator-list';

export default function CustomForecastIndicatorListContainer() {
  return (
    <ClientDataSuspense fallback={<div>loading...</div>}>
      <SWRConfig
        value={{
          suspense: true,
        }}
      >
        <CustomForecastIndicatorList />
      </SWRConfig>
    </ClientDataSuspense>
  );
}
