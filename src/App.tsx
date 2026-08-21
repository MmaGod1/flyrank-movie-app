import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import Hero from './components/Hero'
import GenreBrowser from './components/GenreBrowser'
import MovieDetails from './components/MovieDetails'
import type { Movie } from './components/MovieCard'
import MovieSection from './components/MovieSection'
import Navbar from './components/Navbar'
import { fetchMovieDetails, fetchMovieGenres, fetchMoviesByGenre, fetchPopularMovies, fetchTrendingMovies, searchMovies, type MovieDetails as MovieDetailsData, type MovieGenre } from './services/tmdb'

type AppSection = 'discover' | 'popular' | 'genre' | 'watchlist'

function App() {
  const [searchText, setSearchText] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [isTrendingLoading, setIsTrendingLoading] = useState(true)
  const [trendingError, setTrendingError] = useState('')
  const [genres, setGenres] = useState<MovieGenre[]>([])
  const [isGenresLoading, setIsGenresLoading] = useState(true)
  const [genresError, setGenresError] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<MovieGenre | null>(null)
  const [genreMovies, setGenreMovies] = useState<Movie[]>([])
  const [isGenreLoading, setIsGenreLoading] = useState(false)
  const [genreError, setGenreError] = useState('')
  const [activeSection, setActiveSection] = useState<AppSection>('discover')
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsData | null>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const savedMovies = localStorage.getItem('flyrank-watchlist')

    if (!savedMovies) return []

    try {
      return JSON.parse(savedMovies) as Movie[]
    } catch {
      return []
    }
  })

  async function loadMovies(movieRequest: () => Promise<Movie[]>) {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const nextMovies = await movieRequest()
      setMovies(nextMovies)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('flyrank-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    async function loadPopularMovies() {
      try {
        const popularMovies = await fetchPopularMovies()
        setMovies(popularMovies)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Something went wrong.')
      } finally {
        setIsLoading(false)
      }
    }

    loadPopularMovies()

    async function loadTrending() {
      try {
        const trending = await fetchTrendingMovies()
        setTrendingMovies(trending)
      } catch (error) {
        setTrendingError(error instanceof Error ? error.message : 'Unable to load discovery data.')
      } finally {
        setIsTrendingLoading(false)
      }
    }

    async function loadGenres() {
      try {
        const movieGenres = await fetchMovieGenres()
        setGenres(movieGenres)
      } catch (error) {
        setGenresError(error instanceof Error ? error.message : 'Unable to load genres.')
      } finally {
        setIsGenresLoading(false)
      }
    }

    loadTrending()
    loadGenres()
  }, [])

  function handleSearch(query: string) {
    if (!query) {
      handleClearSearch()
      return
    }

    setIsSearchActive(true)
    setActiveSection('popular')
    setSelectedMovie(null)
    loadMovies(() => searchMovies(query))
  }

  function handleClearSearch() {
    setSearchText('')
    setIsSearchActive(false)
    setActiveSection('popular')
    loadMovies(fetchPopularMovies)
  }

  function handleShowPopular() {
    setSearchText('')
    setIsSearchActive(false)
    setActiveSection('popular')
    setSelectedMovie(null)
    loadMovies(fetchPopularMovies)
  }

  function handleShowDiscover() {
    setSearchText('')
    setIsSearchActive(false)
    setActiveSection('discover')
    setSelectedMovie(null)
    loadMovies(fetchPopularMovies)
  }

  function handleShowWatchlist() {
    setActiveSection('watchlist')
    setSelectedMovie(null)
  }

  async function handleSelectGenre(genre: MovieGenre) {
    setSelectedGenre(genre)
    setActiveSection('genre')
    setIsGenreLoading(true)
    setGenreError('')

    try {
      const nextMovies = await fetchMoviesByGenre(genre.id)
      setGenreMovies(nextMovies)
    } catch (error) {
      setGenreError(error instanceof Error ? error.message : 'Unable to load movies for this genre.')
    } finally {
      setIsGenreLoading(false)
    }
  }

  function handleClearGenre() {
    setSelectedGenre(null)
    setActiveSection('discover')
    setGenreMovies([])
    setGenreError('')
  }

  async function handleSelectMovie(movie: Movie) {
    setIsDetailsLoading(true)
    setDetailsError('')
    setSelectedMovie(null)

    try {
      const details = await fetchMovieDetails(movie.id)
      setSelectedMovie(details)
    } catch (error) {
      setDetailsError(error instanceof Error ? error.message : 'Unable to load movie details.')
    } finally {
      setIsDetailsLoading(false)
    }
  }

  function handleToggleWatchlist() {
    if (!selectedMovie) return

    setWatchlist((currentWatchlist) => {
      const isSaved = currentWatchlist.some((movie) => movie.id === selectedMovie.id)
      return isSaved
        ? currentWatchlist.filter((movie) => movie.id !== selectedMovie.id)
        : [...currentWatchlist, selectedMovie]
    })
  }

  const moviesToDisplay = activeSection === 'watchlist' ? watchlist : movies
  const isSelectedMovieSaved = selectedMovie ? watchlist.some((movie) => movie.id === selectedMovie.id) : false

  return (
    <main className="min-h-screen bg-[#090b12] text-[#f5f7fb]">
      <Navbar
        searchText={searchText}
        onSearchTextChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        onDiscover={handleShowDiscover}
        onPopular={handleShowPopular}
        onWatchlist={handleShowWatchlist}
      />
      {selectedMovie ? (
        <MovieDetails
          movie={selectedMovie}
          isInWatchlist={isSelectedMovieSaved}
          onBack={() => setSelectedMovie(null)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      ) : isDetailsLoading ? (
        <p className="mx-auto max-w-7xl px-6 pb-20 text-center text-slate-400 lg:px-10">Loading movie details...</p>
      ) : detailsError ? (
        <p className="mx-auto max-w-7xl px-6 pb-20 text-center text-red-300 lg:px-10">{detailsError}</p>
      ) : (
        <>
          {activeSection === 'discover' && <Hero />}
          {activeSection === 'discover' && (
            <MovieSection
              id="trending"
              title="Trending This Week"
              movies={trendingMovies}
              isLoading={isTrendingLoading}
              errorMessage={trendingError}
              onSelect={handleSelectMovie}
            />
          )}
          {activeSection === 'discover' && (
            <MovieSection
              id="popular"
              title="Popular Movies"
              movies={movies}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onSelect={handleSelectMovie}
            />
          )}
          {activeSection === 'genre' && selectedGenre && (
            <MovieSection
              title={`${selectedGenre.name} Movies`}
              movies={genreMovies}
              isLoading={isGenreLoading}
              errorMessage={genreError}
              onSelect={handleSelectMovie}
            />
          )}
          {activeSection === 'popular' && (
            <MovieSection
              id="popular"
              title={isSearchActive ? 'Search Results' : 'Popular Movies'}
              movies={movies}
              isLoading={isLoading}
              errorMessage={errorMessage}
              onSelect={handleSelectMovie}
            />
          )}
          {activeSection === 'watchlist' && (
            <MovieSection
              title="My Watchlist"
              movies={moviesToDisplay}
              emptyMessage="Your watchlist is empty"
              onSelect={handleSelectMovie}
            />
          )}
          {activeSection === 'discover' && (
            <GenreBrowser
              genres={genres}
              isLoading={isGenresLoading}
              errorMessage={genresError}
              selectedGenreId={selectedGenre?.id ?? null}
              onSelectGenre={handleSelectGenre}
              onClearGenre={handleClearGenre}
            />
          )}
          {activeSection === 'genre' && (
            <GenreBrowser
              genres={genres}
              isLoading={isGenresLoading}
              errorMessage={genresError}
              selectedGenreId={selectedGenre?.id ?? null}
              onSelectGenre={handleSelectGenre}
              onClearGenre={handleClearGenre}
            />
          )}
        </>
      )}
    </main>
  )
}

export default App
