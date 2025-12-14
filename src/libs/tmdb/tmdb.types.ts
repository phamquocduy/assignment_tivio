export type Genre = {
  id: number;
  name: string;
};

// TMDB types
export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
  adult: boolean;
  popularity: number;
};

export type MovieDetails = Omit<Movie, 'genre_ids'> & {
  genres: Genre[];
  runtime: number | null;
  tagline: string | null;
  status: string;
  budget: number;
  revenue: number;
};

// API response types
export type MoviesResponse = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
};

export type GenresResponse = {
  genres: Genre[];
};
