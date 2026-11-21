import React from 'react';
import { Search, X, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';
import { LEAD_SOURCES, LEAD_STATUSES } from '../../utils/validators.js';

export const SearchFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
  onRefresh,
  isLoading
}) => {
  const hasActiveFilters = Boolean(
    search ||
    (status && status !== 'All') ||
    (source && source !== 'All')
  );

  return (
    <div className="search-filter-card">
      <div className="filter-controls-row">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search leads by name, email, or company..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="dropdowns-group">
          {/* Status Dropdown */}
          <div className="select-wrapper">
            <span className="select-icon-prefix">
              <Filter size={14} />
            </span>
            <select
              className="filter-select"
              value={status || 'All'}
              onChange={(e) => onStatusChange(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses</option>
              {LEAD_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="select-wrapper">
            <select
              className="filter-select"
              value={source || 'All'}
              onChange={(e) => onSourceChange(e.target.value)}
              aria-label="Filter by Source"
            >
              <option value="All">All Sources</option>
              {LEAD_SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="select-wrapper">
            <span className="select-icon-prefix">
              <ArrowUpDown size={14} />
            </span>
            <select
              className="filter-select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                onSortChange(newSortBy, newSortOrder);
              }}
              aria-label="Sort Leads"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="company-asc">Company: A to Z</option>
            </select>
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            className="secondary-btn icon-only-btn"
            onClick={onRefresh}
            title="Refresh Leads"
            disabled={isLoading}
          >
            <RotateCcw size={16} className={isLoading ? 'spin-icon' : ''} />
          </button>
        </div>
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="active-filters-row">
          <span className="active-filters-label">Active filters:</span>
          {search && (
            <span className="filter-chip">
              Search: "{search}"
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {status && status !== 'All' && (
            <span className="filter-chip">
              Status: {status}
              <button
                type="button"
                onClick={() => onStatusChange('All')}
                className="chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {source && source !== 'All' && (
            <span className="filter-chip">
              Source: {source}
              <button
                type="button"
                onClick={() => onSourceChange('All')}
                className="chip-remove"
              >
                <X size={12} />
              </button>
            </span>
          )}
          <button
            type="button"
            className="clear-all-filters-btn"
            onClick={onResetFilters}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

