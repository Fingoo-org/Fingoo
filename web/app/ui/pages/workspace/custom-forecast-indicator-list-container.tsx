import { SWRConfig } from 'swr';
import ClientDataSuspense from '../../components/view/atom/client-data-suspense';

export default function CustomForecastIndicatorListContainer() {
  return (
    <ClientDataSuspense fallback={<div>loading...</div>}>
      <SWRConfig
        value={{
          suspense: true,
        }}
      ></SWRConfig>
    </ClientDataSuspense>
  );
}
