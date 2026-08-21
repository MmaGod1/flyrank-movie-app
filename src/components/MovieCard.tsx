export interface Movie {
  id: number
  title: string
  year: string
  genre: string
  rating: string
  image: string
}

interface MovieCardProps {
  movie: Movie
  onSelect: (movie: Movie) => void
  onRemove?: (movie: Movie) => void
}

function MovieCard({ movie, onSelect, onRemove }: MovieCardProps) {
  return (
    <article className="group relative">
      <button type="button" onClick={() => onSelect(movie)} aria-label={`View details for ${movie.title}`} className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b12]">
      {movie.image ? (
        <img src={movie.image} alt={`${movie.title} poster`} className="aspect-[2/3] w-full rounded-xl object-cover transition duration-300 group-hover:-translate-y-1" />
      ) : (
        <div className="flex aspect-[2/3] w-full items-center justify-center rounded-xl bg-[#20232d] text-sm text-slate-500">No poster</div>
      )}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-['Space_Grotesk'] text-lg font-bold">{movie.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{movie.year}  |  {movie.genre}</p>
        </div>
        <span className="rounded bg-[#20232d] px-2 py-1 text-xs font-bold text-[#f4b942]">{movie.rating}</span>
      </div>
      </button>
      {onRemove && (
        <button type="button" onClick={() => onRemove(movie)} aria-label={`Remove ${movie.title} from watchlist`} className="absolute right-2 top-2 rounded-full bg-[#090b12]/90 px-3 py-2 text-xs font-bold text-white transition sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942]">
          Remove
        </button>
      )}
    </article>
  )
}

export default MovieCard