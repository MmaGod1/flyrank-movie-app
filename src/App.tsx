import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import Hero from './components/Hero'
import MovieCard, { type Movie } from './components/MovieCard'
import Navbar from './components/Navbar'
import { fetchPopularMovies, searchMovies } from './services/tmdb'

function App() {
  const [searchText, setSearchText] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

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
    loadMovies(() => searchMovies(query))
  }

  function handleClearSearch() {
    setSearchText('')
    setIsSearchActive(false)
    loadMovies(fetchPopularMovies)
  }

  return (
    <main className="min-h-screen bg-[#090b12] text-[#f5f7fb]">
      <Navbar
        searchText={searchText}
        onSearchTextChange={(event: ChangeEvent<HTMLInputElement>) => setSearchText(event.target.value)}
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />
      <Hero />

      <section id="popular" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Browse now</p>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold">{isSearchActive ? 'Search results' : 'Popular movies'}</h2>
          </div>
          <button className="text-sm font-bold text-[#f4b942] transition hover:text-[#ffd166]">View all</button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading ? (
            <p className="col-span-full text-center text-slate-400">Loading movies...</p>
          ) : errorMessage ? (
            <p className="col-span-full text-center text-red-300">{errorMessage}</p>
          ) : movies.length > 0 ? (
            movies.map((movie) => <MovieCard key={movie.title} movie={movie} />)
          ) : (
            <p className="col-span-full text-center text-slate-400">No movies found</p>
          )}
        </div>
      </section>
    </main>
  )
}

export default App
