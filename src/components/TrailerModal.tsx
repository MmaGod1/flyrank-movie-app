import { useEffect } from 'react'

interface TrailerModalProps {
  trailerUrl: string | null
  isLoading: boolean
  errorMessage: string
  onClose: () => void
}

function TrailerModal({ trailerUrl, isLoading, errorMessage, onClose }: TrailerModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#141722] p-4 shadow-2xl sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="trailer-modal-title" className="font-['Space_Grotesk'] text-xl font-bold">Watch trailer</h2>
          <button type="button" onClick={onClose} aria-label="Close trailer" className="rounded-full px-3 py-1 text-2xl leading-none text-slate-300 transition hover:bg-[#20232d] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f4b942]">
            &times;
          </button>
        </div>
        {isLoading ? (
          <div className="flex aspect-video items-center justify-center text-slate-400">Loading trailer...</div>
        ) : errorMessage ? (
          <div className="flex aspect-video items-center justify-center px-6 text-center text-red-300">{errorMessage}</div>
        ) : trailerUrl ? (
          <iframe
            src={trailerUrl}
            title="Movie trailer"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="aspect-video w-full rounded-lg"
          />
        ) : (
          <div className="flex aspect-video items-center justify-center px-6 text-center text-slate-300">A trailer is not available for this movie.</div>
        )}
      </div>
    </div>
  )
}

export default TrailerModal