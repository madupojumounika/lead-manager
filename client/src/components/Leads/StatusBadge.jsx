import React from 'react';
import { STATUS_META } from '../../utils/formatters.js';

export const StatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || {
    label: status || 'Unknown',
    color: '#475569',
    bg: '#f1f5f9',
    border: '#cbd5e1',
    dot: '#64748b'
  };

  return (
    <span
      className={`status-badge status-${(status || '').toLowerCase()}`}
      style={{
        backgroundColor: meta.bg,
        color: meta.color,
        borderColor: meta.border
      }}
    >
      <span
        className="status-dot"
        style={{ backgroundColor: meta.dot }}
      />
      {meta.label}
    </span>
  );
};
