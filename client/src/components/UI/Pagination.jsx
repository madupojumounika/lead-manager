import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ pagination, onPageChange, onLimitChange }) => {
  const { total = 0, page = 1, limit = 10, totalPages = 1 } = pagination || {};

  if (total === 0) return null;

  const startRecord = (page - 1) * limit + 1;
  const endRecord = Math.min(page * limit, total);

  // Generate page numbers with window
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);

      if (start === 1) end = Math.min(totalPages, maxVisible);
      if (end === totalPages) start = Math.max(1, totalPages - maxVisible + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    return pages;
  };

  return (
    <div className="pagination-bar">
      <div className="pagination-info">
        <span>
          Showing <strong>{startRecord}</strong> - <strong>{endRecord}</strong> of{' '}
          <strong>{total}</strong> leads
        </span>
        {onLimitChange && (
          <div className="pagination-limit-wrapper">
            <span className="pagination-limit-label">Per page:</span>
            <select
              className="pagination-limit-select"
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-btn"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft size={16} />
          <span className="pagination-btn-text">Previous</span>
        </button>

        <div className="pagination-pages">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              type="button"
              className={`pagination-page-btn ${num === page ? 'active' : ''}`}
              onClick={() => onPageChange(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="pagination-btn"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next Page"
        >
          <span className="pagination-btn-text">Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
