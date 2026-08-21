import MovieCard, { type Movie } from './MovieCard'

interface MovieSectionProps {
  id?: string
  title: string
  movies: Movie[]
  isLoading?: boolean
  errorMessage?: string
  emptyMessage?: string
  onSelect: (movie: Movie) => void
}

function MovieSection({ id, title, movies, isLoading = false, errorMessage = '', emptyMessage = 'No movies found', onSelect }: MovieSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-7xl px-6 pb-16 lg:px-10">
      <div className="mb-7 flex items-end justify-between">
        <h2 className="font-['Space_Grotesk'] text-3xl font-bold">{title}</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <p className="col-span-full text-center text-slate-400">Loading movies...</p>
        ) : errorMessage ? (
          <p className="col-span-full text-center text-red-300">{errorMessage}</p>
        ) : movies.length > 0 ? (
          movies.map((movie) => <MovieCard key={movie.id} movie={movie} onSelect={onSelect} />)
        ) : (
          <p className="col-span-full text-center text-slate-400">{emptyMessage}</p>
        )}
      </div>
    </section>
  )
}

export default MovieSection