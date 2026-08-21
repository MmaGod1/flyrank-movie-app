import type { MovieDetails as MovieDetailsData } from '../services/tmdb'

interface MovieDetailsProps {
  movie: MovieDetailsData
  isInWatchlist: boolean
  onBack: () => void
  onToggleWatchlist: () => void
  onWatchTrailer: () => void
}

function MovieDetails({ movie, isInWatchlist, onBack, onToggleWatchlist, onWatchTrailer }: MovieDetailsProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <button type="button" onClick={onBack} className="mb-8 text-sm font-bold text-[#f4b942] transition hover:text-[#ffd166]">
        Back to movies
      </button>
      <div className="grid gap-8 overflow-hidden rounded-2xl bg-[#141722] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="min-h-[360px] bg-[#20232d]">
          {movie.backdropImage ? (
            <img src={movie.backdropImage} alt={`${movie.title} backdrop`} className="h-full min-h-[360px] w-full object-cover" />
          ) : movie.image ? (
            <img src={movie.image} alt={`${movie.title} poster`} className="mx-auto h-full min-h-[360px] w-full object-contain p-6" />
          ) : (
            <div className="flex min-h-[360px] items-center justify-center text-slate-400">No image available</div>
          )}
        </div>
        <div className="p-8 lg:p-12">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#f4b942]">Movie details</p>
          <h1 className="font-['Space_Grotesk'] text-4xl font-bold sm:text-6xl">{movie.title}</h1>
          <p className="mt-4 text-slate-400">{movie.releaseDate}  |  {movie.genres.join(', ') || 'Movie'}  |  {movie.rating} rating</p>
          <p className="mt-6 max-w-2xl leading-8 text-slate-300">{movie.overview}</p>
          {movie.runtime && <p className="mt-4 text-sm text-slate-400">Runtime: {movie.runtime} minutes</p>}
          <button type="button" onClick={onToggleWatchlist} aria-pressed={isInWatchlist} className="mt-8 rounded-full bg-[#f4b942] px-6 py-3 font-bold text-[#15120b] transition hover:bg-[#ffd166] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          </button>
          <button type="button" onClick={onWatchTrailer} className="ml-3 mt-8 rounded-full border border-slate-700 px-6 py-3 font-bold text-white transition hover:border-[#f4b942] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942]">
            Watch trailer
          </button>
        </div>
      </div>
    </section>
  )
}

export default MovieDetails