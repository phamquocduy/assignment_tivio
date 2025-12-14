'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import axios, { AxiosError, CancelTokenSource } from 'axios';
import {
  TMDB_GENRES_CACHE_DURATION,
  TMDB_MOVIE_DETAILS_CACHE_DURATION,
  TMDB_MOVIES_CACHE_DURATION,
  TMDB_SIMILAR_MOVIES_CACHE_DURATION,
} from '@/libs/tmdb';

// ============================================================================
// CLIENT-SIDE CACHING LAYER
// ============================================================================
//
// This module implements a client-side caching strategy to reduce API calls:
//
// 1. IN-MEMORY CACHE: Stores API responses with URL-based TTL (time-to-live)
//    - Genres: 24 hours (static data that rarely changes)
//    - Movie details: 1 hour (semi-static content)
//    - Similar movies: 1 hour (semi-static content)
//    - Movies list: 5 minutes (dynamic content with filters/pagination)
//
// 2. REQUEST DEDUPLICATION: If multiple components request the same URL
//    simultaneously, only one network request is made and the result is
//    shared across all callers.
//
// 3. CACHE BYPASS: The refetch() function bypasses cache to get fresh data,
//    useful for retry buttons after errors.
//
// Benefits:
// - Opening the same movie twice won't make duplicate API calls
// - Genres are fetched once and reused across the session
// - Instant UI when navigating to previously viewed content

interface CacheEntry<T> {
  data: T;
  timestamp: number; // When the data was cached (ms since epoch)
}

// Global in-memory cache for API responses
// Key: URL string, Value: { data, timestamp }
const cache = new Map<string, CacheEntry<unknown>>();

// Track in-flight requests to prevent duplicate simultaneous requests
// Key: URL string, Value: Promise of the pending request
const inFlightRequests = new Map<string, Promise<unknown>>();

/**
 * Determines cache TTL (time-to-live) based on URL pattern.
 * Different endpoints have different freshness requirements.
 */
function getCacheTTL(url: string): number {
  // Genres: Static data, rarely changes - cache for 24 hours
  if (url.includes('/api/genres')) {
    return TMDB_GENRES_CACHE_DURATION * 1000; // 24 hours in ms
  }

  // Movie details (/api/movies/123): Semi-static - cache for 1 hour
  if (url.match(/\/api\/movies\/\d+$/) || url.match(/\/api\/movies\/\d+\?/)) {
    return TMDB_MOVIE_DETAILS_CACHE_DURATION * 1000; // 1 hour in ms
  }

  // Similar movies: Semi-static - cache for 1 hour
  if (url.includes('/similar')) {
    return TMDB_SIMILAR_MOVIES_CACHE_DURATION * 1000; // 1 hour in ms
  }

  // Movies list (with filters/pagination): Dynamic - cache for 5 minutes
  return TMDB_MOVIES_CACHE_DURATION * 1000; // 5 minutes in ms
}

/**
 * Check if cached data is still valid
 */
function isCacheValid<T>(entry: CacheEntry<T> | undefined, ttl: number): entry is CacheEntry<T> {
  if (!entry) return false;
  return Date.now() - entry.timestamp < ttl;
}

/**
 * Get data from cache if valid
 */
function getFromCache<T>(url: string): T | null {
  const entry = cache.get(url) as CacheEntry<T> | undefined;
  const ttl = getCacheTTL(url);

  if (isCacheValid(entry, ttl)) {
    return entry.data;
  }

  // Remove stale cache entry
  if (entry) {
    cache.delete(url);
  }

  return null;
}

function setCache<T>(url: string, data: T): void {
  cache.set(url, { data, timestamp: Date.now() });
}

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

  const [data, setData] = useState<T | null>(() => {
    if (url) {
      return getFromCache<T>(url);
    }

    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    if (url && getFromCache<T>(url)) {
      return false;
    }

    return immediate && !!url;
  });

  const [error, setError] = useState<string | null>(null);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const execute = useCallback(
    async (bypassCache = false) => {
      if (!url) return;

      // STEP 1: Check cache first (unless explicitly bypassing)
      // This provides instant data for previously fetched URLs
      if (!bypassCache) {
        const cachedData = getFromCache<T>(url);
        if (cachedData) {
          setData(cachedData);
          setIsLoading(false);
          setError(null);
          return; // Cache hit - no network request needed
        }
      }

      // STEP 2: Check for in-flight request (request deduplication)
      // If another component is already fetching this URL, wait for that request
      // instead of making a duplicate network call
      const existingRequest = inFlightRequests.get(url);
      if (existingRequest && !bypassCache) {
        try {
          setIsLoading(true);
          const result = (await existingRequest) as T;
          setData(result);
          setError(null);
        } catch (err) {
          if (!axios.isCancel(err)) {
            setError(getErrorMessage(err));
          }
        } finally {
          setIsLoading(false);
        }
        return; // Reused existing request
      }

      // STEP 3: Cancel any previous request from this hook instance
      // Prevents race conditions when URL changes rapidly
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel();
      }

      const source = axios.CancelToken.source();
      cancelTokenRef.current = source;

      setIsLoading(true);
      setError(null);

      // STEP 4: Make the actual network request
      const requestPromise = axios
        .get<T>(url, { cancelToken: source.token })
        .then((response) => {
          // Store successful response in cache for future use
          setCache(url, response.data);
          return response.data;
        })
        .finally(() => {
          // Clean up: Remove from in-flight tracking when done
          inFlightRequests.delete(url);
        });

      // Register this request for deduplication
      // Other components requesting the same URL will reuse this promise
      inFlightRequests.set(url, requestPromise);

      try {
        const result = await requestPromise;
        setData(result);
      } catch (err) {
        if (axios.isCancel(err)) return; // Ignore cancelled requests
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    },
    [url]
  );

  const refetch = useCallback(() => {
    execute(true);
  }, [execute]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }

    return () => {
      cancelTokenRef.current?.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps -- `execute` is stable (depends only on `url`), `deps` spread is intentional for refetch triggers
  }, [immediate, url, execute, ...deps]);

  return { data, isLoading, error, refetch };
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
