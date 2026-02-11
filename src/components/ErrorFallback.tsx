'use client';

import { FallbackProps } from 'react-error-boundary';

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <svg className="h-16 w-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h2 className="mt-4 text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-2 max-w-md text-sm text-gray-400">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}
