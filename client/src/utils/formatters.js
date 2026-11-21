export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
};

export const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(dateString);
};

export const STATUS_META = {
  New: {
    label: 'New',
    color: '#0284c7',
    bg: '#e0f2fe',
    border: '#bae6fd',
    dot: '#0284c7'
  },
  Contacted: {
    label: 'Contacted',
    color: '#d97706',
    bg: '#fef3c7',
    border: '#fde68a',
    dot: '#d97706'
  },
  Qualified: {
    label: 'Qualified',
    color: '#16a34a',
    bg: '#dcfce7',
    border: '#bbf7d0',
    dot: '#16a34a'
  },
  Lost: {
    label: 'Lost',
    color: '#dc2626',
    bg: '#fee2e2',
    border: '#fecaca',
    dot: '#dc2626'
  }
};

