import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import Hero from './components/Hero'
import MovieDetails from './components/MovieDetails'
import MovieCard, { type Movie } from './components/MovieCard'
import Navbar from './components/Navbar'
import { fetchMovieDetails, fetchPopularMovies, searchMovies, type MovieDetails as MovieDetailsData } from './services/tmdb'

type AppSection = 'discover' | 'popular' | 'watchlist'

function App() {
  const [searchText, setSearchText] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
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
      <section id="popular" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Browse now</p>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold">
              {activeSection === 'watchlist' ? 'My watchlist' : isSearchActive ? 'Search results' : 'Popular movies'}
            </h2>
          </div>
          <button className="text-sm font-bold text-[#f4b942] transition hover:text-[#ffd166]">View all</button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activeSection === 'watchlist' ? (
            moviesToDisplay.length > 0 ? moviesToDisplay.map((movie) => <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />) : (
              <p className="col-span-full text-center text-slate-400">Your watchlist is empty</p>
            )
          ) : isLoading ? (
            <p className="col-span-full text-center text-slate-400">Loading movies...</p>
          ) : errorMessage ? (
            <p className="col-span-full text-center text-red-300">{errorMessage}</p>
          ) : moviesToDisplay.length > 0 ? (
            moviesToDisplay.map((movie) => <MovieCard key={movie.id} movie={movie} onSelect={handleSelectMovie} />)
          ) : (
            <p className="col-span-full text-center text-slate-400">No movies found</p>
          )}
        </div>
      </section>
        </>
      )}
    </main>
  )
}

export default App
