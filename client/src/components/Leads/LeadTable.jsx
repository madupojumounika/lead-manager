import React from 'react';
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Mail,
  Phone,
  Building,
  Calendar,
  Tag,
  UserPlus,
  Inbox
} from 'lucide-react';
import { StatusBadge } from './StatusBadge.jsx';
import { formatDate } from '../../utils/formatters.js';
import { LEAD_STATUSES } from '../../utils/validators.js';

export const LeadTable = ({
  leads = [],
  isLoading = false,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  onSortChange,
  onEditLead,
  onDeleteLead,
  onStatusQuickChange,
  onOpenCreateModal,
  onResetFilters,
  hasFilters = false
}) => {
  const renderSortIndicator = (columnKey) => {
    if (sortBy !== columnKey) {
      return <ArrowUpDown size={14} className="sort-icon-inactive" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={14} className="sort-icon-active" />
    ) : (
      <ArrowDown size={14} className="sort-icon-active" />
    );
  };

  const handleHeaderSort = (columnKey) => {
    if (sortBy === columnKey) {
      onSortChange(columnKey, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(columnKey, columnKey === 'name' ? 'asc' : 'desc');
    }
  };

  if (isLoading) {
    return (
      <div className="table-card">
        <div className="table-loading-container">
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="table-card empty-state-card">
        <div className="empty-state-icon-wrapper">
          <Inbox size={42} />
        </div>
        <h3 className="empty-state-title">
          {hasFilters ? 'No leads match your filters' : 'No leads registered yet'}
        </h3>
        <p className="empty-state-description">
          {hasFilters
            ? 'Try adjusting your search query, status, or source filters to find what you are looking for.'
            : 'Get started by creating your first sales lead to track opportunities in your CRM.'}
        </p>
        <div className="empty-state-actions">
          {hasFilters ? (
            <button
              type="button"
              className="secondary-btn"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={onOpenCreateModal}
            >
              <UserPlus size={16} />
              Add Your First Lead
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="table-card">
      {/* Desktop / Tablet Table View */}
      <div className="table-responsive">
        <table className="leads-table">
          <thead>
            <tr>
              <th
                className="sortable-header"
                onClick={() => handleHeaderSort('name')}
                title="Sort by Name"
              >
                <div className="header-content">
                  <span>Name & Company</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th>Contact Info</th>
              <th>Source</th>
              <th>Status</th>
              <th
                className="sortable-header"
                onClick={() => handleHeaderSort('createdAt')}
                title="Sort by Date Created"
              >
                <div className="header-content">
                  <span>Created Date</span>
                  {renderSortIndicator('createdAt')}
                </div>
              </th>
              <th className="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => {
              const initials = lead.name
                ? lead.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)
                : 'LD';

              return (
                <tr key={lead.id || lead._id} className="lead-row">
                  {/* Name and Company */}
                  <td className="lead-name-cell">
                    <div className="lead-avatar-info">
                      <div className="lead-avatar" aria-hidden="true">
                        {initials}
                      </div>
                      <div className="lead-meta">
                        <span className="lead-name">{lead.name}</span>
                        <span className="lead-company">
                          <Building size={12} className="meta-icon" />
                          {lead.company}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email & Phone */}
                  <td className="lead-contact-cell">
                    <div className="contact-links">
                      <a
                        href={`mailto:${lead.email}`}
                        className="contact-link"
                        title={lead.email}
                      >
                        <Mail size={13} className="meta-icon" />
                        <span>{lead.email}</span>
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        className="contact-link phone-link"
                        title={lead.phone}
                      >
                        <Phone size={13} className="meta-icon" />
                        <span>{lead.phone}</span>
                      </a>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="lead-source-cell">
                    <span className="source-tag">
                      <Tag size={12} className="meta-icon" />
                      {lead.source}
                    </span>
                  </td>

                  {/* Status with quick change option */}
                  <td className="lead-status-cell">
                    <div className="status-dropdown-wrapper">
                      <StatusBadge status={lead.status} />
                      <select
                        className="quick-status-select"
                        value={lead.status}
                        onChange={(e) =>
                          onStatusQuickChange(lead.id || lead._id, e.target.value)
                        }
                        title="Click to quickly update status"
                        aria-label={`Change status for ${lead.name}`}
                      >
                        {LEAD_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            Mark as {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Date Created */}
                  <td className="lead-date-cell">
                    <div className="date-wrapper">
                      <Calendar size={13} className="meta-icon" />
                      <span>{formatDate(lead.createdAt)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="lead-actions-cell">
                    <div className="row-actions">
                      <button
                        type="button"
                        className="action-btn edit-action-btn"
                        onClick={() => onEditLead(lead)}
                        title={`Edit ${lead.name}`}
                        aria-label={`Edit ${lead.name}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="action-btn delete-action-btn"
                        onClick={() => onDeleteLead(lead)}
                        title={`Delete ${lead.name}`}
                        aria-label={`Delete ${lead.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-leads-list">
        {leads.map((lead) => (
          <div key={lead.id || lead._id} className="mobile-lead-card">
            <div className="mobile-card-top">
              <div className="mobile-lead-primary">
                <span className="mobile-lead-name">{lead.name}</span>
                <span className="mobile-lead-company">
                  <Building size={12} />
                  {lead.company}
                </span>
              </div>
              <StatusBadge status={lead.status} />
            </div>

            <div className="mobile-card-body">
              <div className="mobile-detail-row">
                <Mail size={13} />
                <a href={`mailto:${lead.email}`}>{lead.email}</a>
              </div>
              <div className="mobile-detail-row">
                <Phone size={13} />
                <a href={`tel:${lead.phone}`}>{lead.phone}</a>
              </div>
              <div className="mobile-detail-row">
                <Tag size={13} />
                <span>{lead.source}</span>
                <span className="mobile-date-sep">•</span>
                <Calendar size={13} />
                <span>{formatDate(lead.createdAt)}</span>
              </div>
            </div>

            <div className="mobile-card-actions">
              <select
                className="mobile-status-select"
                value={lead.status}
                onChange={(e) =>
                  onStatusQuickChange(lead.id || lead._id, e.target.value)
                }
              >
                {LEAD_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Status: {st}
                  </option>
                ))}
              </select>
              <div className="mobile-btn-group">
                <button
                  type="button"
                  className="secondary-btn btn-sm"
                  onClick={() => onEditLead(lead)}
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  className="danger-btn btn-sm"
                  onClick={() => onDeleteLead(lead)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

