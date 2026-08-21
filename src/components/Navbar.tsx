import type { ChangeEvent, FormEvent } from 'react'

interface NavbarProps {
  searchText: string
  onSearchTextChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function Navbar({ searchText, onSearchTextChange }: NavbarProps) {

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-6 lg:px-10">
      <div className="flex w-full items-center justify-between">
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
      </div>

      <form onSubmit={handleSearch} className="mx-auto flex w-full max-w-2xl">
        <label htmlFor="movie-search" className="sr-only">Search for a movie</label>
        <input
          id="movie-search"
          type="search"
          value={searchText}
          onChange={onSearchTextChange}
          placeholder="Search for a movie..."
          className="min-w-0 flex-1 rounded-l-full border border-slate-700 bg-[#141722] px-5 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-[#f4b942]"
        />
        <button type="submit" className="rounded-r-full bg-[#f4b942] px-6 py-3 text-sm font-bold text-[#15120b] transition hover:bg-[#ffd166]">
          Search
        </button>
      </form>
    </nav>
  )
}

export default Navbar