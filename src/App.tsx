import Hero from './components/Hero'
import MovieCard, { type Movie } from './components/MovieCard'
import Navbar from './components/Navbar'

const popularMovies: Movie[] = [
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
      <Navbar />
      <Hero />

      <section id="popular" className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Browse now</p>
            <h2 className="font-['Space_Grotesk'] text-3xl font-bold">Popular movies</h2>
          </div>
          <button className="text-sm font-bold text-[#f4b942] transition hover:text-[#ffd166]">View all</button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {popularMovies.map((movie) => <MovieCard key={movie.title} movie={movie} />)}
        </div>
      </section>
    </main>
  )
}

export default App
