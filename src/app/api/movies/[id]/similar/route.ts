import { NextRequest, NextResponse } from 'next/server';

import { fetchSimilarMovies, TMDB_SIMILAR_MOVIES_CACHE_DURATION } from '@/libs/tmdb';
import { toIntBase10 } from '@/utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movieId = toIntBase10(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const data = await fetchSimilarMovies(movieId);

    // Cache-Control header for browser/CDN caching:
    // - public: Response can be cached by browsers and CDNs
    // - max-age=${TMDB_SIMILAR_MOVIES_CACHE_DURATION}: Cache is fresh for TMDB_SIMILAR_MOVIES_CACHE_DURATION
    // - stale-while-revalidate=300: Serve stale content for up to 5 minutes while revalidating
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=${TMDB_SIMILAR_MOVIES_CACHE_DURATION}, stale-while-revalidate=300`,
      },
    });
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return NextResponse.json({ error: 'Failed to fetch similar movies' }, { status: 500 });
  }
}
