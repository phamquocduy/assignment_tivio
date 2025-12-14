import { NextRequest, NextResponse } from 'next/server';

import { fetchMovieDetails } from '@/libs/tmdb';
import { toIntBase10 } from '@/utils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const movieId = toIntBase10(id);

    if (isNaN(movieId)) {
      return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
    }

    const data = await fetchMovieDetails(movieId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return NextResponse.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
