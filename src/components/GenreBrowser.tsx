import type { MovieGenre } from '../services/tmdb'

interface GenreBrowserProps {
  genres: MovieGenre[]
  isLoading: boolean
  errorMessage: string
  selectedGenreId: number | null
  onSelectGenre: (genre: MovieGenre) => void
  onClearGenre: () => void
}

function GenreBrowser({ genres, isLoading, errorMessage, selectedGenreId, onSelectGenre, onClearGenre }: GenreBrowserProps) {
  return (
    <section id="genres" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Find your mood</p>
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold">Browse by genre</h2>
        </div>
        {selectedGenreId !== null && (
          <button type="button" onClick={onClearGenre} className="text-sm font-bold text-[#f4b942] transition hover:text-[#ffd166]">
            Back to popular
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading genres...</p>
        ) : errorMessage ? (
          <p className="text-sm text-red-300">{errorMessage}</p>
        ) : genres.map((genre) => (
          <button
            type="button"
            key={genre.id}
            onClick={() => onSelectGenre(genre)}
            className={`rounded-full border px-4 py-2 text-sm transition ${selectedGenreId === genre.id ? 'border-[#f4b942] bg-[#f4b942] text-[#15120b]' : 'border-slate-700 text-slate-300 hover:border-[#f4b942] hover:text-white'}`}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </section>
  )
}

export default GenreBrowser