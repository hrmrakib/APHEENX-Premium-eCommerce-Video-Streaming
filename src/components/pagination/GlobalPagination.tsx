interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function GlobalPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Prevent rendering if there's only one page
  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center gap-2 mt-8'>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className='px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-surface transition-colors'
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className='flex gap-1'>
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-lg border transition-all ${
                currentPage === pageNumber
                  ? "gold-gradient text-black border-gold"
                  : "border-border hover:border-gold/50"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className='px-4 py-2 rounded-lg border border-border disabled:opacity-50 hover:bg-surface transition-colors'
      >
        Next
      </button>
    </div>
  );
}
