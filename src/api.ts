const API_KEY = "0bc8bd2db453d7413d1c2844ec617b61";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  name: string;
  media_type: string;
  original_title: string;
  popularity: number;
  vote_average: number;
  release_date: string;
  original_language: string;
  first_air_date: string;
  adult: boolean;
  vote_count: number;
  genre_ids: number[];
}
interface ITv {
  genre_ids: number[];
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  name: string;
  media_type: string;
  original_title: string;
  popularity: number;
  vote_average: number;
  release_date: string;
  original_language: string;
  origin_country: string[];
  first_air_date: string;
  adult: boolean;
  vote_count: number;
}

export type Review = {
  author: string;
  content: string;
};

export type ContentsState<T> = {
  [key: number]: T[];
};

export interface IGetmoviesResult {
  dates: {
    maximum: string;
    minimun: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export interface IGetTvRanking {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

interface IGenre {
  id: number;
  name: string;
}

export interface IGetGenresResult {
  genres: IGenre[];
}

export const getMovies = () => {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-kr&region=kr`
  ).then((response) => response.json());
};

export const getSearch = (query: string) => {
  return fetch(
    `${BASE_PATH}/search/multi?query=${query}&include_adult=true&language=ko-kr&page=1&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getGenres = () => {
  return fetch(
    `${BASE_PATH}/genre/movie/list?&language=ko-kr&api_key=${API_KEY}`
  ).then((response) => response.json());
};

export const getTvTop = () => {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}&language=ko-kr&page=1`
  ).then((response) => response.json());
};

export const getUpcomingMovie = () => {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}&language=ko-kr&page=1&region=kr`
  ).then((response) => response.json());
};
export const getPopularMovie = () => {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko-kr&page=1&region=kr`
  ).then((response) => response.json());
};

export const fetchVideos = (movieId: number) => {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/videos?language=en-US&page=1&api_key=${API_KEY}`
  ).then((response) => response.json());
};
