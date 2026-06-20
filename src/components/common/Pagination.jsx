/**
 * Pagination — page navigation controls with page-size selector.
 * Renders Previous/Next buttons plus direct page links for nearby pages.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZES = [10, 25, 50, 100];

export const Pagination = ({
  page,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  const start = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalCount);

  /**
   * Build a compact page-number list with ellipsis for large ranges.
   * Always shows first, last, current, and immediate neighbours.
   */
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // neighbours on each side of current page

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= page - delta && i <= page + delta)
      ) {
        pages.push(i);
      }
    }

    // Insert ellipsis markers where gaps exist
    const withEllipsis = [];
    pages.forEach((p, idx) => {
      if (idx > 0 && p - pages[idx - 1] > 1) {
        withEllipsis.push('…');
      }
      withEllipsis.push(p);
    });

    return withEllipsis;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
      {/* Record count summary */}
      <p className="text-sm text-gray-500 shrink-0">
        Showing <span className="font-medium text-gray-700">{start}–{end}</span> of{' '}
        <span className="font-medium text-gray-700">{totalCount}</span> users
      </p>

      <div className="flex items-center gap-3">
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:inline">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Rows per page"
          >
            {PAGE_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageNumbers().map((p, idx) =>
            p === '…' ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 text-sm">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors
                  ${p === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
