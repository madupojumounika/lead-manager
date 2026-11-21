import React from 'react';
import { Menu, UserPlus, Activity } from 'lucide-react';

export const Header = ({ onOpenSidebar, onOpenCreateModal, apiHealthy = true }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onOpenSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-title-group">
          <h1 className="header-title">Leads Management</h1>
          <p className="header-subtitle">
            Track, qualify, and convert prospective business clients
          </p>
        </div>
      </div>

      <div className="header-right">
        {/* API Health indicator */}
        <div className="api-health-badge" title="Backend API status">
          <span className={`health-dot ${apiHealthy ? 'healthy' : 'degraded'}`} />
          <span className="health-label">API {apiHealthy ? 'Online' : 'Offline'}</span>
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          className="primary-btn add-lead-btn"
          onClick={onOpenCreateModal}
        >
          <UserPlus size={16} />
          <span>Add Lead</span>
        </button>
      </div>
    </header>
  );
};
