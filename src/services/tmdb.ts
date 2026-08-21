import type { Movie } from '../components/MovieCard'

const TMDB_API_URL = 'https://api.themoviedb.org/3/movie/popular'
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

export async function fetchPopularMovies(): Promise<Movie[]> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY

  if (!apiKey || apiKey === 'your_tmdb_api_key_here') {
    throw new Error('TMDB API key is missing. Add it to your .env file.')
  }

  const response = await fetch(`${TMDB_API_URL}?api_key=${apiKey}&language=en-US&page=1`)

  if (!response.ok) {
    throw new Error('Unable to load movies from TMDB.')
  }

  const data: TmdbPopularResponse = await response.json()

  return data.results
    .filter((movie) => movie.poster_path)
    .map((movie) => ({
      title: movie.title,
      year: movie.release_date ? movie.release_date.slice(0, 4) : 'Unknown',
      genre: 'Movie',
      rating: movie.vote_average.toFixed(1),
      image: `${TMDB_IMAGE_URL}${movie.poster_path}`,
    }))
}