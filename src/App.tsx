const popularMovies = [
  {
    title: 'The Last Horizon',
    year: '2024',
    genre: 'Sci-fi',
    rating: '8.4',
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Midnight Streets',
    year: '2023',
    genre: 'Drama',
    rating: '8.1',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Wild Frequency',
    year: '2024',
    genre: 'Adventure',
    rating: '7.9',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'After the Storm',
    year: '2022',
    genre: 'Thriller',
    rating: '7.8',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=600&q=80',
  },
]

function App() {
  return (
    <main className="min-h-screen bg-[#090b12] text-[#f5f7fb]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <a href="#top" className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight">
          FLY<span className="text-[#f4b942]">RANK</span>
        </a>
        <div className="hidden gap-8 text-sm text-slate-300 md:flex">
          <a href="#top" className="text-white">Discover</a>
          <a href="#popular" className="transition hover:text-white">Popular</a>
          <a href="#watchlist" className="transition hover:text-white">My watchlist</a>
        </div>
        <button className="rounded-full border border-slate-700 px-4 py-2 text-sm font-medium transition hover:border-[#f4b942]">
          Sign in
        </button>
      </nav>

      <section id="top" className="mx-auto grid max-w-7xl items-center gap-10 px-6 pb-20 pt-10 lg:grid-cols-[1fr_0.85fr] lg:px-10 lg:pt-20">
        <div className="max-w-xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-[#f4b942]">Featured movie</p>
          <h1 className="font-['Space_Grotesk'] text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Dune: Part Two
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
            Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="rounded-full bg-[#f4b942] px-6 py-3 font-bold text-[#15120b] transition hover:bg-[#ffd166]">
              Watch trailer
            </button>
            <span className="text-sm text-slate-400">2024  |  Sci-fi, Adventure  |  8.7 rating</span>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85"
          alt="A cinematic desert landscape"
          className="h-[420px] w-full rounded-2xl object-cover shadow-2xl shadow-black/50 lg:h-[500px]"
        />
      </section>

      <section id="popular" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Browse now</p>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold">Popular movies</h2>
          </div>
          <button className="text-sm font-bold text-[#f4b942] transition hover:text-[#ffd166]">View all</button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularMovies.map((movie) => (
            <article key={movie.title} className="group">
              <img src={movie.image} alt={`${movie.title} poster`} className="aspect-[2/3] w-full rounded-xl object-cover transition duration-300 group-hover:-translate-y-1" />
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold">{movie.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{movie.year}  |  {movie.genre}</p>
                </div>
                <span className="rounded bg-[#20232d] px-2 py-1 text-xs font-bold text-[#f4b942]">{movie.rating}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
