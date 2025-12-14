import { MovieFilters } from '@/types';

export const MIN_YEAR = 1990;
export const CURRENT_YEAR = new Date().getFullYear();

export const MIN_RATING = 0;
export const MAX_RATING = 10;
export const RATING_STEP = 0.5;
export const DEFAULT_RATING = 6;

export const DEFAULT_FILTERS: MovieFilters = {
  genres: [],
  yearRange: [MIN_YEAR, CURRENT_YEAR],
  minRating: DEFAULT_RATING,
};

export const DEFAULT_TIMER_DURATION = 20;

// Sort options
export enum SortOption {
  POPULARITY_DESC = 'popularity.desc',
  TITLE_ASC = 'original_title.asc',
  TITLE_DESC = 'original_title.desc',
  RATING_DESC = 'vote_average.desc',
  RATING_ASC = 'vote_average.asc',
  RELEASE_DESC = 'release_date.desc',
  RELEASE_ASC = 'release_date.asc',
}
export const DEFAULT_SORT = SortOption.POPULARITY_DESC;
export const SORT_OPTIONS = [
  { label: 'Popularity', value: SortOption.POPULARITY_DESC },
  { label: 'Title (A-Z)', value: SortOption.TITLE_ASC },
  { label: 'Title (Z-A)', value: SortOption.TITLE_DESC },
  { label: 'Rating (High to Low)', value: SortOption.RATING_DESC },
  { label: 'Rating (Low to High)', value: SortOption.RATING_ASC },
  { label: 'Release (Newest)', value: SortOption.RELEASE_DESC },
  { label: 'Release (Oldest)', value: SortOption.RELEASE_ASC },
] as const;
