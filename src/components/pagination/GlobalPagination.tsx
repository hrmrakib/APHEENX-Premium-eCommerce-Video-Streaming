interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GlobalPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Logic to calculate the range of visible pages (3 at a time)
  // This shifts the window: 1-3, then 4-6, etc.
  const groupSize = 3;
  const currentGroup = Math.ceil(currentPage / groupSize);
  const startPage = (currentGroup - 1) * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className='flex items-center justify-center gap-2 mt-8'>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-4 py-2 rounded-lg border border-white/10 text-white/60 disabled:opacity-30 hover:bg-white/5 transition-colors text-sm'
      >
        Prev
      </button>

      {/* Page Numbers */}
      <div className='flex gap-1'>
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`w-10 h-10 rounded-lg border text-sm transition-all ${
              currentPage === pageNumber
                ? "bg-linear-to-r from-yellow-600 to-yellow-400 text-black border-yellow-500 font-bold"
                : "border-white/10 text-white/60 hover:border-yellow-500/50"
            }`}
          >
            {pageNumber}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-4 py-2 rounded-lg border border-white/10 text-white/60 disabled:opacity-30 hover:bg-white/5 transition-colors text-sm'
      >
        Next
      </button>
    </div>
  );
}
