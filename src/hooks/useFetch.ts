'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';

interface UseFetchOptions {
  /** Whether to fetch immediately on mount */
  immediate?: boolean;
  /** Dependencies that trigger refetch when changed */
  deps?: unknown[];
}

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string | null, options: UseFetchOptions = {}): UseFetchResult<T> {
  const { immediate = true, deps = [] } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(immediate && !!url);
  const [error, setError] = useState<string | null>(null);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const execute = useCallback(async () => {
    if (!url) return;

    // Cancel previous request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel();
    }

    const source = axios.CancelToken.source();
    cancelTokenRef.current = source;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get<T>(url, { cancelToken: source.token });
      setData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) return;
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }

    return () => {
      cancelTokenRef.current?.cancel();
    };
  }, [immediate, url, ...deps]);

  return { data, isLoading, error, refetch: execute };
}

/**
 * Extract user-friendly error message from axios error
 */
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;

    // Server responded with error
    if (axiosError.response) {
      const { status, data } = axiosError.response;

      // Use server error message if available
      if (data?.error) return data.error;

      switch (status) {
        case 404:
          return 'Not found';
        case 429:
          return 'Too many requests. Please wait a moment.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'Failed to load data. Please try again.';
      }
    }

    // Network error
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Unable to connect. Please check your internet connection.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong. Please try again.';
}
