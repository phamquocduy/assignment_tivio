import { NextRequest, NextResponse } from 'next/server';

import { fetchMovies, TMDB_MOVIES_CACHE_DURATION } from '@/libs/tmdb';
import type { MovieFilters } from '@/types';
import { toIntBase10 } from '@/utils';
import { DEFAULT_SORT, SortOption } from '@/constants';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: Partial<MovieFilters> = {};

    // Parse genres
    const genresParam = searchParams.get('genres');
    if (genresParam) {
      filters.genres = genresParam.split(',').map(Number).filter(Boolean);
    }

    // Parse year range
    const yearFrom = searchParams.get('year_from');
    const yearTo = searchParams.get('year_to');
    if (yearFrom && yearTo) {
      filters.yearRange = [toIntBase10(yearFrom), toIntBase10(yearTo)];
    }

    // Parse minimum rating
    const minRating = searchParams.get('min_rating');
    if (minRating) {
      filters.minRating = parseFloat(minRating);
    }

    const page = toIntBase10(searchParams.get('page'), 1);
    const sort = (searchParams.get('sort') as SortOption) || DEFAULT_SORT;
    const data = await fetchMovies(filters, page, sort);

    // Cache-Control header for browser/CDN caching:
    // - public: Response can be cached by browsers and CDNs
    // - max-age=${TMDB_MOVIES_CACHE_DURATION}: Cache is fresh for TMDB_MOVIES_CACHE_DURATION
    // - stale-while-revalidate=60: Serve stale content for up to 1 minute while revalidating
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': `public, max-age=${TMDB_MOVIES_CACHE_DURATION}, stale-while-revalidate=60`,
      },
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
