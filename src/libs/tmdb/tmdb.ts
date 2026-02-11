import type { MovieFilters } from '@/types';

import type { MoviesResponse, MovieDetails, GenresResponse } from './tmdb.types';
import { SortOption } from '@/constants';

const TMDB_API_BASE = 'https://api.themoviedb.org/3';

export const TMDB_GENRES_CACHE_DURATION = 24 * 60 * 60; // 24 hours, (genres rarely change)
export const TMDB_SIMILAR_MOVIES_CACHE_DURATION = 60 * 60; // 1 hour, (similar movies are semi-static)
export const TMDB_MOVIE_DETAILS_CACHE_DURATION = 60 * 60; // 1 hour, (movie details are semi-static)
export const TMDB_MOVIES_CACHE_DURATION = 5 * 60; // 5 minutes, (movie lists change more frequently)

function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('TMDB_API_KEY environment variable is not set');
  }

  return apiKey;
}

export async function fetchGenres(): Promise<GenresResponse> {
  const response = await fetch(
    `${TMDB_API_BASE}/genre/movie/list?api_key=${getApiKey()}&language=en-US`,
    { next: { revalidate: TMDB_GENRES_CACHE_DURATION } } 
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.status}`);
  }

  return response.json();
}

export async function fetchMovies(
  filters: Partial<MovieFilters>,
  page: number = 1,
  sort: SortOption = SortOption.POPULARITY_DESC
): Promise<MoviesResponse> {
  const params = new URLSearchParams({
    api_key: getApiKey(),
    language: 'en-US',
    include_adult: 'false',
    page: String(page),
    sort_by: sort,
  });

  // Add genre filter
  if (filters.genres && filters.genres.length > 0) {
    params.set('with_genres', filters.genres.join(','));
  }

  // Add year range filter
  if (filters.yearRange) {
    const [startYear, endYear] = filters.yearRange;
    params.set('primary_release_date.gte', `${startYear}-01-01`);
    params.set('primary_release_date.lte', `${endYear}-12-31`);
  }

  // Add minimum rating filter
  if (filters.minRating !== undefined && filters.minRating > 0) {
    params.set('vote_average.gte', String(filters.minRating));
    params.set('vote_count.gte', '50'); // Ensure movies have enough votes
  }

  const response = await fetch(
    `${TMDB_API_BASE}/discover/movie?${params.toString()}`,
    { next: { revalidate: TMDB_MOVIES_CACHE_DURATION } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  return response.json();
}

export async function fetchMovieDetails(id: number): Promise<MovieDetails> {
  const response = await fetch(
    `${TMDB_API_BASE}/movie/${id}?api_key=${getApiKey()}&language=en-US`,
    { next: { revalidate: TMDB_MOVIE_DETAILS_CACHE_DURATION } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch movie details: ${response.status}`);
  }

  return response.json();
}

export async function fetchSimilarMovies(id: number): Promise<MoviesResponse> {
  const response = await fetch(
    `${TMDB_API_BASE}/movie/${id}/similar?api_key=${getApiKey()}&language=en-US&page=1`,
    { next: { revalidate: TMDB_SIMILAR_MOVIES_CACHE_DURATION } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch similar movies: ${response.status}`);
  }

  return response.json();
}
