import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import Hero from './components/Hero'
import GenreBrowser from './components/GenreBrowser'
import MovieDetails from './components/MovieDetails'
import type { Movie } from './components/MovieCard'
import MovieSection from './components/MovieSection'
import Navbar from './components/Navbar'
import TrailerModal from './components/TrailerModal'
import { fetchMovieDetails, fetchMovieGenres, fetchMovieTrailer, fetchMoviesByGenrePage, fetchPopularMoviesPage, fetchTrendingMovies, searchMoviesPage, type MovieDetails as MovieDetailsData, type MovieGenre } from './services/tmdb'

type AppSection = 'discover' | 'popular' | 'genre' | 'watchlist'
const FEATURED_MOVIE_ID = 693134

function isMovie(value: unknown): value is Movie {
  if (!value || typeof value !== 'object') return false

  const movie = value as Partial<Movie>
  return typeof movie.id === 'number' && typeof movie.title === 'string' && typeof movie.image === 'string'
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [lastSearchTerm, setLastSearchTerm] = useState('')
  const [popularPage, setPopularPage] = useState(1)
  const [popularTotalPages, setPopularTotalPages] = useState(1)
  const [isLoadingMorePopular, setIsLoadingMorePopular] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [searchTotalPages, setSearchTotalPages] = useState(1)
  const [isLoadingMoreSearch, setIsLoadingMoreSearch] = useState(false)
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
  const [genrePage, setGenrePage] = useState(1)
  const [genreTotalPages, setGenreTotalPages] = useState(1)
  const [isLoadingMoreGenre, setIsLoadingMoreGenre] = useState(false)
  const [activeSection, setActiveSection] = useState<AppSection>('discover')
  const [selectedMovie, setSelectedMovie] = useState<MovieDetailsData | null>(null)
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [isDetailsLoading, setIsDetailsLoading] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isTrailerLoading, setIsTrailerLoading] = useState(false)
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null)
  const [trailerError, setTrailerError] = useState('')
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const savedMovies = localStorage.getItem('flyrank-watchlist')

    if (!savedMovies) return []

    try {
      const parsedMovies: unknown = JSON.parse(savedMovies)
      return Array.isArray(parsedMovies) ? parsedMovies.filter(isMovie) : []
    } catch {
      return []
    }
  })
  const requestId = useRef(0)
  const hasLoadedDiscovery = useRef(false)

  async function loadPopularMovies() {
    const currentRequestId = ++requestId.current
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await fetchPopularMoviesPage(1)
      if (currentRequestId !== requestId.current) return
      setMovies(result.movies)
      setPopularPage(result.page)
      setPopularTotalPages(result.totalPages)
    } catch (error) {
      if (currentRequestId === requestId.current) {
        setErrorMessage(error instanceof Error ? error.message : 'We could not load movies. Please try again.')
      }
    } finally {
      if (currentRequestId === requestId.current) setIsLoading(false)
    }
  }

  async function loadSearchResults(query: string) {
    const currentRequestId = ++requestId.current
    setIsLoading(true)
    setErrorMessage('')

    try {
      const result = await searchMoviesPage(query, 1)
      if (currentRequestId !== requestId.current) return
      setMovies(result.movies)
      setSearchPage(result.page)
      setSearchTotalPages(result.totalPages)
    } catch (error) {
      if (currentRequestId === requestId.current) {
        setErrorMessage(error instanceof Error ? error.message : 'We could not search movies. Please try again.')
      }
    } finally {
      if (currentRequestId === requestId.current) setIsLoading(false)
    }
  }

  async function loadTrendingMovies() {
    setIsTrendingLoading(true)
    setTrendingError('')

    try {
      setTrendingMovies(await fetchTrendingMovies())
    } catch (error) {
      setTrendingError(error instanceof Error ? error.message : 'We could not load trending movies. Please try again.')
    } finally {
      setIsTrendingLoading(false)
    }
  }

  async function loadGenres() {
    setIsGenresLoading(true)
    setGenresError('')

    try {
      setGenres(await fetchMovieGenres())
    } catch (error) {
      setGenresError(error instanceof Error ? error.message : 'We could not load genres. Please try again.')
    } finally {
      setIsGenresLoading(false)
    }
  }

  useEffect(() => {
    localStorage.setItem('flyrank-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    if (hasLoadedDiscovery.current) return
    hasLoadedDiscovery.current = true

    loadPopularMovies()

    loadTrendingMovies()
    loadGenres()
  }, [])

  function handleSearch(query: string) {
    if (!query) {
      handleClearSearch()
      return
    }

    setIsSearchActive(true)
    setLastSearchTerm(query)
    setSearchPage(1)
    setActiveSection('popular')
    setSelectedMovie(null)
    loadSearchResults(query)
  }

  function handleClearSearch() {
    setSearchText('')
    setIsSearchActive(false)
    setLastSearchTerm('')
    setSearchPage(1)
    setActiveSection('popular')
    loadPopularMovies()
  }

  function handleShowPopular() {
    if (activeSection === 'popular' && !isSearchActive) return
    setSearchText('')
    setIsSearchActive(false)
    setLastSearchTerm('')
    setPopularPage(1)
    setActiveSection('popular')
    setSelectedMovie(null)
    loadPopularMovies()
  }

  function handleShowDiscover() {
    if (activeSection === 'discover' && !isSearchActive) return
    setSearchText('')
    setIsSearchActive(false)
    setLastSearchTerm('')
    setPopularPage(1)
    setActiveSection('discover')
    setSelectedMovie(null)
    loadPopularMovies()
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
    setGenrePage(1)

    try {
      const nextMovies = await fetchMoviesByGenrePage(genre.id, 1)
      setGenreMovies(nextMovies.movies)
      setGenrePage(nextMovies.page)
      setGenreTotalPages(nextMovies.totalPages)
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

  function appendUniqueMovies(currentMovies: Movie[], nextMovies: Movie[]) {
    const existingIds = new Set(currentMovies.map((movie) => movie.id))
    return [...currentMovies, ...nextMovies.filter((movie) => !existingIds.has(movie.id))]
  }

  async function handleLoadMorePopular() {
    setIsLoadingMorePopular(true)
    try {
      const nextPage = await fetchPopularMoviesPage(popularPage + 1)
      setMovies((currentMovies) => appendUniqueMovies(currentMovies, nextPage.movies))
      setPopularPage(nextPage.page)
      setPopularTotalPages(nextPage.totalPages)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load more popular movies.')
    } finally {
      setIsLoadingMorePopular(false)
    }
  }

  async function handleLoadMoreSearch() {
    setIsLoadingMoreSearch(true)
    try {
      const nextPage = await searchMoviesPage(lastSearchTerm, searchPage + 1)
      setMovies((currentMovies) => appendUniqueMovies(currentMovies, nextPage.movies))
      setSearchPage(nextPage.page)
      setSearchTotalPages(nextPage.totalPages)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load more search results.')
    } finally {
      setIsLoadingMoreSearch(false)
    }
  }

  async function handleLoadMoreGenre() {
    if (!selectedGenre) return

    setIsLoadingMoreGenre(true)
    try {
      const nextPage = await fetchMoviesByGenrePage(selectedGenre.id, genrePage + 1)
      setGenreMovies((currentMovies) => appendUniqueMovies(currentMovies, nextPage.movies))
      setGenrePage(nextPage.page)
      setGenreTotalPages(nextPage.totalPages)
    } catch (error) {
      setGenreError(error instanceof Error ? error.message : 'Unable to load more genre movies.')
    } finally {
      setIsLoadingMoreGenre(false)
    }
  }

  async function handleSelectMovie(movie: Movie) {
    setSelectedMovieId(movie.id)
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

  async function handleWatchTrailer(movieId: number) {
    setIsTrailerOpen(true)
    setIsTrailerLoading(true)
    setTrailerUrl(null)
    setTrailerError('')

    try {
      const url = await fetchMovieTrailer(movieId)
      setTrailerUrl(url)
    } catch (error) {
      setTrailerError(error instanceof Error ? error.message : 'We could not load the trailer. Please try again.')
    } finally {
      setIsTrailerLoading(false)
    }
  }

  function handleCloseTrailer() {
    setIsTrailerOpen(false)
    setTrailerUrl(null)
    setTrailerError('')
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
        watchlistCount={watchlist.length}
      />
      {selectedMovie ? (
        <MovieDetails
          movie={selectedMovie}
          isInWatchlist={isSelectedMovieSaved}
          onBack={() => setSelectedMovie(null)}
          onToggleWatchlist={handleToggleWatchlist}
          onWatchTrailer={() => handleWatchTrailer(selectedMovie.id)}
        />
      ) : isDetailsLoading ? (
        <p className="mx-auto max-w-7xl px-6 pb-20 text-center text-slate-400 lg:px-10">Loading movie details...</p>
      ) : detailsError ? (
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 pb-20 text-center lg:px-10">
          <p className="text-red-300">{detailsError}</p>
          {selectedMovieId && <button type="button" onClick={() => handleSelectMovie({ id: selectedMovieId, title: '', year: '', genre: '', rating: '', image: '' })} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-white transition hover:border-[#f4b942] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942]">Try again</button>}
        </div>
      ) : (
        <>
          {activeSection === 'discover' && <Hero onWatchTrailer={() => handleWatchTrailer(FEATURED_MOVIE_ID)} />}
          {activeSection === 'discover' && (
            <MovieSection
              id="trending"
              title="Trending This Week"
              movies={trendingMovies}
              isLoading={isTrendingLoading}
              errorMessage={trendingError}
              onSelect={handleSelectMovie}
              onRetry={loadTrendingMovies}
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
              onRetry={handleShowDiscover}
              onLoadMore={handleLoadMorePopular}
              hasMore={popularPage < popularTotalPages}
              isLoadingMore={isLoadingMorePopular}
            />
          )}
          {activeSection === 'genre' && selectedGenre && (
            <MovieSection
              title={`${selectedGenre.name} Movies`}
              movies={genreMovies}
              isLoading={isGenreLoading}
              errorMessage={genreError}
              onSelect={handleSelectMovie}
              onRetry={() => selectedGenre && handleSelectGenre(selectedGenre)}
              onLoadMore={handleLoadMoreGenre}
              hasMore={genrePage < genreTotalPages}
              isLoadingMore={isLoadingMoreGenre}
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
              resultsLabel={isSearchActive ? `Showing ${movies.length} results for “${lastSearchTerm}”` : undefined}
              onRetry={isSearchActive ? () => handleSearch(lastSearchTerm) : handleShowPopular}
              onLoadMore={isSearchActive ? handleLoadMoreSearch : handleLoadMorePopular}
              hasMore={isSearchActive ? searchPage < searchTotalPages : popularPage < popularTotalPages}
              isLoadingMore={isSearchActive ? isLoadingMoreSearch : isLoadingMorePopular}
            />
          )}
          {activeSection === 'watchlist' && (
            <MovieSection
              title="My Watchlist"
              movies={moviesToDisplay}
              emptyMessage="Your watchlist is empty"
              onSelect={handleSelectMovie}
              onRemove={(movie) => setWatchlist((current) => current.filter((savedMovie) => savedMovie.id !== movie.id))}
            />
          )}
          {activeSection === 'discover' && (
            <GenreBrowser
              genres={genres}
              isLoading={isGenresLoading}
              errorMessage={genresError}
              onRetry={loadGenres}
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
              onRetry={loadGenres}
              selectedGenreId={selectedGenre?.id ?? null}
              onSelectGenre={handleSelectGenre}
              onClearGenre={handleClearGenre}
            />
          )}
        </>
      )}
      {isTrailerOpen && (
        <TrailerModal
          trailerUrl={trailerUrl}
          isLoading={isTrailerLoading}
          errorMessage={trailerError}
          onClose={handleCloseTrailer}
        />
      )}
    </main>
  )
}

export default App
