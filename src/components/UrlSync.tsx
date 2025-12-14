'use client';

import { useUrlSync } from '@/hooks';

/**
 * Client component that syncs URL with app state.
 * Renders nothing - just runs the URL sync hook.
 */
export function UrlSync() {
  useUrlSync();
  return null;
}
