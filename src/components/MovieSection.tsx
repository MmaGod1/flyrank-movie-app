import MovieCard, { type Movie } from './MovieCard'

interface MovieSectionProps {
  id?: string
  title: string
  movies: Movie[]
  isLoading?: boolean
  errorMessage?: string
  emptyMessage?: string
  onSelect: (movie: Movie) => void
  onRemove?: (movie: Movie) => void
  onRetry?: () => void
  onLoadMore?: () => void
  hasMore?: boolean
  isLoadingMore?: boolean
  resultsLabel?: string
}

function MovieSection({ id, title, movies, isLoading = false, errorMessage = '', emptyMessage = 'No movies found', onSelect, onRemove, onRetry, onLoadMore, hasMore = false, isLoadingMore = false, resultsLabel }: MovieSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
      <div className="mb-7 flex items-end justify-between">
        <div>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold">{title}</h2>
          {resultsLabel && <p className="mt-2 text-sm text-slate-400">{resultsLabel}</p>}
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <p className="col-span-full text-center text-slate-400">Loading movies...</p>
        ) : errorMessage ? (
          <div className="col-span-full flex flex-col items-center gap-4 text-center">
            <p className="text-red-300">{errorMessage}</p>
            {onRetry && <button type="button" onClick={onRetry} className="rounded-full border border-slate-700 px-4 py-2 text-sm font-bold text-white transition hover:border-[#f4b942] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942]">Try again</button>}
          </div>
        ) : movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} onSelect={onSelect} onRemove={onRemove} />)
        ) : (
          <p className="col-span-full text-center text-slate-400">{emptyMessage}</p>
        )}
      </div>
      {hasMore && !isLoading && !errorMessage && (
        <div className="mt-8 text-center">
          <button type="button" onClick={onLoadMore} disabled={isLoadingMore} className="rounded-full border border-slate-700 px-6 py-3 text-sm font-bold text-white transition hover:border-[#f4b942] disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942]">
            {isLoadingMore ? 'Loading more...' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  )
}

export default MovieSection