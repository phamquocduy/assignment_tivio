import { NextResponse } from 'next/server';

import { fetchGenres } from '@/libs/tmdb';

export async function GET() {
  try {
    const data = await fetchGenres();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
