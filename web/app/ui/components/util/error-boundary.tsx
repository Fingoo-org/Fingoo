'use client';
import { UnauthorizedError } from '@/app/utils/http/http-error';
import Link from 'next/link';
import { Component, ComponentType, PropsWithChildren } from 'react';

export interface FallbackProps {
  error: Error;
  resetErrorBoundary?: () => void;
}

interface ErrorBoundaryProps {
  onReset?: () => void;
}

interface ErrorBoundaryState {
  error: Error | null;
}

const initialState: ErrorBoundaryState = {
  error: null,
};

class ErrorBoundary extends Component<PropsWithChildren<ErrorBoundaryProps>, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
  };

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState(initialState);
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error instanceof UnauthorizedError) {
      return (
        <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">
          <div>로그인이 필요합니다</div>
          <Link href="/">to Login</Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
