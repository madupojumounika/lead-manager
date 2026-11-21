import React from 'react';
import {
  LayoutDashboard,
  Users,
  Target,
  Sparkles,
  ExternalLink,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, activeNav = 'leads', onNavChange }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-mobile-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Brand / Logo */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-logo-icon">
              <Target size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-title">LeadFlow</span>
              <span className="brand-subtitle">Meru Screening CRM</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="sidebar-nav-section">
          <div className="nav-group-label">MAIN NAVIGATION</div>
          <nav className="sidebar-nav">
            <button
              type="button"
              className={`nav-item ${activeNav === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                onNavChange('dashboard');
                onClose?.();
              }}
            >
              <LayoutDashboard size={18} />
              <span>Pipeline Dashboard</span>
            </button>

            <button
              type="button"
              className={`nav-item ${activeNav === 'leads' ? 'active' : ''}`}
              onClick={() => {
                onNavChange('leads');
                onClose?.();
              }}
            >
              <Users size={18} />
              <span>Leads Directory</span>
            </button>
          </nav>

          <div className="nav-group-label">PROJECT CONTEXT</div>
          <div className="sidebar-badge-card">
            <div className="badge-card-icon">
              <ShieldCheck size={18} />
            </div>
            <div className="badge-card-text">
              <span className="badge-card-title">Meru Technosoft</span>
              <span className="badge-card-desc">Full-Stack Screening</span>
            </div>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="sidebar-footer">
          <div className="user-profile-widget">
            <div className="user-avatar">MM</div>
            <div className="user-info">
              <span className="user-name">Mounika Madupoju</span>
              <span className="user-role">Full-Stack Developer</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
