import type { Movie } from '../components/MovieCard'

const TMDB_API_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p/w500'

interface TmdbMovie {
  title: string
  release_date: string
  vote_average: number
  poster_path: string | null
}

interface TmdbPopularResponse {
  results: TmdbMovie[]
}

function mapMovies(movies: TmdbMovie[]): Movie[] {
  return movies
    .filter((movie) => movie.poster_path)
    .map((movie) => ({
      title: movie.title,
      year: movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown',
      genre: 'Movie',
      rating: movie.vote_average.toFixed(1),
      image: `${TMDB_IMAGE_URL}${movie.poster_path}`,
    }))
}

async function fetchMovies(endpoint: string): Promise<Movie[]> {
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
  return mapMovies(data.results)
}

export async function fetchPopularMovies(): Promise<Movie[]> {
  return fetchMovies('/movie/popular?page=1')
}

export async function searchMovies(query: string): Promise<Movie[]> {
  return fetchMovies(`/search/movie?query=${encodeURIComponent(query)}`)
}