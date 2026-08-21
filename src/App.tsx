import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import Hero from './components/Hero'
import GenreBrowser from './components/GenreBrowser'
import MovieDetails from './components/MovieDetails'
import type { Movie } from './components/MovieCard'
import MovieSection from './components/MovieSection'
import Navbar from './components/Navbar'
import { fetchMovieDetails, fetchMovieGenres, fetchMoviesByGenrePage, fetchPopularMovies, fetchPopularMoviesPage, fetchTrendingMovies, searchMoviesPage, type MovieDetails as MovieDetailsData, type MovieGenre } from './services/tmdb'

type AppSection = 'discover' | 'popular' | 'genre' | 'watchlist'

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
        const popularMovies = await fetchPopularMoviesPage(1)
        setMovies(popularMovies.movies)
        setPopularPage(popularMovies.page)
        setPopularTotalPages(popularMovies.totalPages)
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
    setLastSearchTerm(query)
    setSearchPage(1)
    setActiveSection('popular')
    setSelectedMovie(null)
    setIsLoading(true)
    setErrorMessage('')
    searchMoviesPage(query, 1)
      .then((result) => {
        setMovies(result.movies)
        setSearchPage(result.page)
        setSearchTotalPages(result.totalPages)
      })
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : 'Unable to search movies.'))
      .finally(() => setIsLoading(false))
  }

  function handleClearSearch() {
    setSearchText('')
    setIsSearchActive(false)
    setLastSearchTerm('')
    setSearchPage(1)
    setActiveSection('popular')
    loadMovies(fetchPopularMovies)
  }

  function handleShowPopular() {
    setSearchText('')
    setIsSearchActive(false)
    setLastSearchTerm('')
    setPopularPage(1)
    setActiveSection('popular')
    setSelectedMovie(null)
    loadMovies(fetchPopularMovies)
  }

  function handleShowDiscover() {
    setSearchText('')
    setIsSearchActive(false)
    setLastSearchTerm('')
    setPopularPage(1)
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
