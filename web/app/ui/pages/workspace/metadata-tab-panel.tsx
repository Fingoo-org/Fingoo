import dynamic from 'next/dynamic';
import { SWRConfig } from 'swr';

const MetadataList = dynamic(() => import('../../components/numerical-guidance/metadata-list'), {
  ssr: false,
  loading: () => <div>loading...</div>,
});

export default function MetadataTabPanel() {
  return (
    <SWRConfig
      value={{
        suspense: true,
      }}
    >
      <MetadataList />;
    </SWRConfig>
  );
}
