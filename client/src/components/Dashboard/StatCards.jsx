import React from 'react';
import { Users, UserPlus, PhoneCall, CheckCircle, XCircle } from 'lucide-react';

export const StatCards = ({ stats, currentStatusFilter, onSelectStatusFilter, isLoading }) => {
  const { total = 0, new: newCount = 0, contacted = 0, qualified = 0, lost = 0 } = stats || {};

  const cards = [
    {
      id: 'All',
      label: 'Total Leads',
      count: total,
      icon: Users,
      color: '#2563eb',
      bgLight: '#eff6ff',
      borderActive: '#2563eb',
      subtext: 'All active records'
    },
    {
      id: 'New',
      label: 'New Leads',
      count: newCount,
      icon: UserPlus,
      color: '#0284c7',
      bgLight: '#e0f2fe',
      borderActive: '#0284c7',
      subtext: total > 0 ? `${Math.round((newCount / total) * 100)}% of total` : '0% of total'
    },
    {
      id: 'Contacted',
      label: 'Contacted',
      count: contacted,
      icon: PhoneCall,
      color: '#d97706',
      bgLight: '#fef3c7',
      borderActive: '#d97706',
      subtext: total > 0 ? `${Math.round((contacted / total) * 100)}% of total` : '0% of total'
    },
    {
      id: 'Qualified',
      label: 'Qualified',
      count: qualified,
      icon: CheckCircle,
      color: '#16a34a',
      bgLight: '#dcfce7',
      borderActive: '#16a34a',
      subtext: total > 0 ? `${Math.round((qualified / total) * 100)}% of total` : '0% of total'
    },
    {
      id: 'Lost',
      label: 'Lost',
      count: lost,
      icon: XCircle,
      color: '#dc2626',
      bgLight: '#fee2e2',
      borderActive: '#dc2626',
      subtext: total > 0 ? `${Math.round((lost / total) * 100)}% of total` : '0% of total'
    }
  ];

  return (
    <div className="stat-cards-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = (currentStatusFilter || 'All') === card.id;

        return (
          <div
            key={card.id}
            className={`stat-card ${isSelected ? 'stat-card-active' : ''}`}
            onClick={() => onSelectStatusFilter(card.id)}
            role="button"
            tabIndex={0}
            title={`Filter by ${card.label}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectStatusFilter(card.id);
              }
            }}
          >
            <div className="stat-card-header">
              <span className="stat-card-label">{card.label}</span>
              <div
                className="stat-card-icon"
                style={{ backgroundColor: card.bgLight, color: card.color }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="stat-card-body">
              {isLoading ? (
                <div className="stat-skeleton" />
              ) : (
                <div className="stat-card-value">{card.count}</div>
              )}
            </div>

            <div className="stat-card-footer">
              <span className="stat-card-subtext">{card.subtext}</span>
              {isSelected && <span className="stat-filter-indicator">Filtered</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

