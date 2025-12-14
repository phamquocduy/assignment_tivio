import { NextRequest, NextResponse } from 'next/server';

import { fetchSimilarMovies } from '@/libs/tmdb';
import { toIntBase10 } from '@/utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movieId = toIntBase10(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const data = await fetchSimilarMovies(movieId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return NextResponse.json({ error: 'Failed to fetch similar movies' }, { status: 500 });
  }
}
