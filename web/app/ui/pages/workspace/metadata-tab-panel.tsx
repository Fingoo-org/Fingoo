import { SWRConfig } from 'swr';
import MetadataList from '../../components/numerical-guidance/metadata-list';
import ClientDataSuspense from '../../components/view/atom/client-data-suspense';

export default function MetadataTabPanel() {
  return (
    <ClientDataSuspense fallback={<div>loading...</div>}>
      <SWRConfig
        value={{
          suspense: true,
        }}
      >
        <MetadataList />;
      </SWRConfig>
    </ClientDataSuspense>
  );
}
