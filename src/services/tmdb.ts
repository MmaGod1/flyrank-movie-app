import type { Movie } from '../components/MovieCard'

const TMDB_API_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

interface TmdbMovie {
  id: number
  title: string
  release_date?: string
  vote_average: number
  poster_path: string | null
}

interface TmdbPopularResponse {
  results: TmdbMovie[]
  page: number
  total_pages: number
}

export interface MoviePage {
  movies: Movie[]
  page: number
  totalPages: number
}

export interface MovieGenre {
  id: number
  name: string
}

interface TmdbGenreResponse {
  genres: MovieGenre[]
}

function mapMovies(movies: TmdbMovie[]): Movie[] {
  return movies.map((movie) => ({
      id: movie.id,
      title: movie.title,
      year: movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown',
      genre: 'Movie',
      rating: movie.vote_average.toFixed(1),
      image: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : '',
    }))
}

async function fetchMoviesPage(endpoint: string): Promise<MoviePage> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    throw new Error('TMDB API key is missing. Add it to your .env file.')
  }

  const separator = endpoint.includes('?') ? '&' : '?'
  const response = await fetch(`${TMDB_API_URL}${endpoint}${separator}api_key=${apiKey}&language=en-US`)

  if (!response.ok) {
    throw new Error('Unable to load movies from TMDB.')
  }

  const data: TmdbPopularResponse = await response.json()
  return {
    movies: mapMovies(data.results),
    page: data.page,
    totalPages: data.total_pages,
  }
}

async function fetchMovies(endpoint: string): Promise<Movie[]> {
  const data = await fetchMoviesPage(endpoint)
  return data.movies
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  return fetchMovies('/movie/popular?page=1')
}

export async function fetchPopularMoviesPage(page: number): Promise<MoviePage> {
  return fetchMoviesPage(`/movie/popular?page=${page}`)
}

export async function fetchTrendingMovies(): Promise<Movie[]> {
  return fetchMovies('/trending/movie/week')
}

export async function fetchMovieGenres(): Promise<MovieGenre[]> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    throw new Error('TMDB API key is missing. Add it to your .env file.')
  }

  const response = await fetch(`${TMDB_API_URL}/genre/movie/list?api_key=${apiKey}&language=en-US`)

  if (!response.ok) {
    throw new Error('Unable to load movie genres from TMDB.')
  }

  const data: TmdbGenreResponse = await response.json()
  return data.genres
}

export async function fetchMoviesByGenre(genreId: number): Promise<Movie[]> {
  return fetchMovies(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=1`)
}

export async function fetchMoviesByGenrePage(genreId: number, page: number): Promise<MoviePage> {
  return fetchMoviesPage(`/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`)
}

export async function searchMovies(query: string): Promise<Movie[]> {
  return fetchMovies(`/search/movie?query=${encodeURIComponent(query)}`)
}

export async function searchMoviesPage(query: string, page: number): Promise<MoviePage> {
  return fetchMoviesPage(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`)
}

export interface MovieDetails extends Movie {
  backdropImage: string | null
  releaseDate: string
  genres: string[]
  overview: string
  runtime: number | null
}

interface TmdbMovieDetails extends TmdbMovie {
  backdrop_path: string | null
  genres: { id: number; name: string }[]
  overview: string
  runtime: number | null
}

export async function fetchMovieDetails(movieId: number): Promise<MovieDetails> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    throw new Error('TMDB API key is missing. Add it to your .env file.')
  }

  const response = await fetch(`${TMDB_API_URL}/movie/${movieId}?api_key=${apiKey}&language=en-US`)

  if (!response.ok) {
    throw new Error('Unable to load movie details from TMDB.')
  }

  const movie: TmdbMovieDetails = await response.json()

  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown',
    genre: movie.genres.map((genre) => genre.name).join(', ') || 'Movie',
    rating: movie.vote_average.toFixed(1),
    image: movie.poster_path ? `${TMDB_IMAGE_URL}${movie.poster_path}` : '',
    backdropImage: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
    releaseDate: movie.release_date || 'Unknown',
    genres: movie.genres.map((genre) => genre.name),
    overview: movie.overview || 'No overview available.',
    runtime: movie.runtime,
  }
}