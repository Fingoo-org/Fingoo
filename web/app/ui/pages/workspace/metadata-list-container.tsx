import { SWRConfig } from 'swr';
import MetadataList from '../../components/numerical-guidance/molecule/metadata-list';
import ClientDataSuspense from '../../components/view/atom/client-data-suspense';

export default function MetadataListContainer() {
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
