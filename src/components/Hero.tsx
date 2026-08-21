interface HeroProps {
  onWatchTrailer: () => void
}

function Hero({ onWatchTrailer }: HeroProps) {
  return (
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
          <button type="button" onClick={onWatchTrailer} className="rounded-full bg-[#f4b942] px-6 py-3 font-bold text-[#15120b] transition hover:bg-[#ffd166] focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
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
  )
}

export default Hero