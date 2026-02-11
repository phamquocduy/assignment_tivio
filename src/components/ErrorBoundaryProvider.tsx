'use client';

import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from './ErrorFallback';

export function ErrorBoundaryProvider({ children }: PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
