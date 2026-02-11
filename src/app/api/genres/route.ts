import { NextResponse } from 'next/server';

import { fetchGenres, TMDB_GENRES_CACHE_DURATION } from '@/libs/tmdb';

export async function GET() {
  try {
    const data = await fetchGenres();

    // Cache-Control header for browser/CDN caching:
    // - public: Response can be cached by browsers and CDNs
    // - max-age=${TMDB_GENRES_CACHE_DURATION}: Cache is fresh for TMDB_GENRES_CACHE_DURATION
    // - stale-while-revalidate=3600: Serve stale content for up to 1 hour while revalidating
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=${TMDB_GENRES_CACHE_DURATION}, stale-while-revalidate=3600`,
      },
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
