// 현재 suspense의 동작이 nextJS 등 여러 프레임워크와 결합되면서 불안정하다고 판단
// 특히 swr와 같은 데이터 패칭과 결합 시 더 예상하지 못한 에러가 발생함
// 따라서 안정화될 때 까지는 커스텀하여 Suspense를 사용하도록 한다.
// 우리 프로젝트에서 발생한 오류는 다음과 같다.
// 1. Error: Fallback data is required when using suspense in SSR: next 빌드 시 클라이언트 컴포넌트임에도 정적 빌드를 위해 서버 컴포넌트와 같이 fallback data를 필요로 한다. 이 경우 클라이언트에서 fallback 컴포넌트를 제공할 수 없어지기에 유스케이스에 적합하지 않아진다.
// 2. https://react-ko.dev/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content: React 공홈에서 제안하는 서버 전용 fallback을 생성하는 방식이나 Next(14.0.4) 정적 페이지 빌드 시에 적용 되지 않음, 또 Suspense의 자식 컴포넌트가 Suspense 아래에서 사용된다는 것을 아는 점에서 필요 이상으로 강하게 결합하여 좋은 구조인지 모르겠음
// 3. useSearchParam 사용?: https://github.com/vercel/next.js/discussions/53049 에서 제안된 방법 정적 페이지 빌드 시에 문제가 생기는 것이기 때문에, useSearchParam를 사용하여 해당 컴포넌트를 동적 렌더링으로 변경하는 것, 오류가 생기지는 않으나 useSearchParam를 맥락없이 사용하게 된다.
// 이 외에도 https://github.com/vercel/swr/issues/2702 와 같은 swr와 기존 React.lazy + suspense or next/dynamic을 사용한 csr 방식 동작에서도 문제가 발생했다.
import { PropsWithChildren, Suspense as ReactSuspense } from 'react';

const isServer = typeof window === 'undefined';

type SuspenseProps = {
  fallback: React.ReactNode;
};

export default function ClientDataSuspense({ children, fallback }: PropsWithChildren<SuspenseProps>) {
  return isServer ? <>{fallback}</> : <ReactSuspense fallback={fallback}>{children}</ReactSuspense>;
}
