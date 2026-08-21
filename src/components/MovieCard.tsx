export interface Movie {
  title: string
  year: string
  genre: string
  rating: string
  image: string
}

interface MovieCardProps {
  movie: Movie
}

function MovieCard({ movie }: MovieCardProps) {
  return (
    <article className="group">
      <img src={movie.image} alt={`${movie.title} poster`} className="aspect-[2/3] w-full rounded-xl object-cover transition duration-300 group-hover:-translate-y-1" />
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-['Space_Grotesk'] text-lg font-bold">{movie.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{movie.year}  |  {movie.genre}</p>
        </div>
        <span className="rounded bg-[#20232d] px-2 py-1 text-xs font-bold text-[#f4b942]">{movie.rating}</span>
      </div>
    </article>
  )
}

export default MovieCard