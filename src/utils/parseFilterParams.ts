import { MIN_YEAR, CURRENT_YEAR, MIN_RATING, MAX_RATING, SortOption } from '@/constants';

type ParamGetter = (key: string) => string | null;

export type ParsedFilterParams = {
  genres?: number[];
  yearRange?: [number, number];
  minRating?: number;
  page?: number;
  sort?: SortOption;
  movieId?: number | null;
};

const VALID_SORT_OPTIONS = Object.values(SortOption);

/**
 * Parses URL parameters into validated filter state.
 * Uses a getter function to abstract the param source (URLSearchParams or Record).
 */
export function parseFilterParams(get: ParamGetter): ParsedFilterParams {
  const result: ParsedFilterParams = {};

  // Parse genres (comma-separated IDs)
  const genresParam = get('genres');
  if (genresParam) {
    result.genres = genresParam
      .split(',')
      .map((id) => parseInt(id, 10))
      .filter((id) => !isNaN(id) && id > 0);
  }

  // Parse year range
  const yearFromParam = get('year_from');
  const yearToParam = get('year_to');
  if (yearFromParam || yearToParam) {
    const yearFrom = yearFromParam ? parseInt(yearFromParam, 10) : MIN_YEAR;
    const yearTo = yearToParam ? parseInt(yearToParam, 10) : CURRENT_YEAR;
    const validYearFrom = Math.max(MIN_YEAR, Math.min(yearFrom, CURRENT_YEAR));
    const validYearTo = Math.max(validYearFrom, Math.min(yearTo, CURRENT_YEAR));
    result.yearRange = [validYearFrom, validYearTo];
  }

  // Parse min rating
  const minRatingParam = get('min_rating');
  if (minRatingParam) {
    const minRating = parseFloat(minRatingParam);
    if (!isNaN(minRating)) {
      result.minRating = Math.max(MIN_RATING, Math.min(minRating, MAX_RATING));
    }
  }

  // Parse page
  const pageParam = get('page');
  if (pageParam) {
    const page = parseInt(pageParam, 10);
    if (!isNaN(page) && page > 0) {
      result.page = page;
    }
  }

  // Parse sort
  const sortParam = get('sort');
  if (sortParam && VALID_SORT_OPTIONS.includes(sortParam as SortOption)) {
    result.sort = sortParam as SortOption;
  }

  // Parse movie ID for modal
  const movieParam = get('movie');
  if (movieParam) {
    const movieId = parseInt(movieParam, 10);
    if (!isNaN(movieId) && movieId > 0) {
      result.movieId = movieId;
    }
  }

  return result;
}
