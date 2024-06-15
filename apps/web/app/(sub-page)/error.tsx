'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { UnauthorizedError } from '../utils/http/http-error';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  if (error instanceof UnauthorizedError) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
        <div>로그인이 필요합니다</div>
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
        >
          to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Something went wrong!!!!!</h2>
      <button
        onClick={
          // 세그먼트를 재 렌더링 하여 복구를 시도합니다.
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}
