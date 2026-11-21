import React from 'react';
import {
  TrendingUp,
  Award,
  Layers,
  ArrowRight,
  UserPlus,
  Building,
  Calendar,
  Sparkles,
  PieChart
} from 'lucide-react';
import { StatCards } from './StatCards.jsx';
import { StatusBadge } from '../Leads/StatusBadge.jsx';
import { formatDate } from '../../utils/formatters.js';
import { LEAD_SOURCES } from '../../utils/validators.js';

export const PipelineView = ({
  stats,
  leads = [],
  onNavigateToLeads,
  onOpenCreateModal,
  onEditLead,
  isLoading
}) => {
  const { total = 0, new: newCount = 0, contacted = 0, qualified = 0, lost = 0 } = stats || {};

  const conversionRate = total > 0 ? ((qualified / total) * 100).toFixed(1) : '0.0';
  const activeLeadsCount = newCount + contacted;
  const activeRate = total > 0 ? ((activeLeadsCount / total) * 100).toFixed(1) : '0.0';
  const closedRate = total > 0 ? (((qualified + lost) / total) * 100).toFixed(1) : '0.0';

  // Compute source distribution from current leads
  const sourceCounts = LEAD_SOURCES.reduce((acc, src) => {
    acc[src] = 0;
    return acc;
  }, {});

  leads.forEach((l) => {
    if (sourceCounts[l.source] !== undefined) {
      sourceCounts[l.source]++;
    }
  });

  // Recent 5 leads
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stageBreakdown = [
    { label: 'New Prospects', count: newCount, color: '#0284c7', bg: '#e0f2fe', id: 'New' },
    { label: 'Contacted', count: contacted, color: '#d97706', bg: '#fef3c7', id: 'Contacted' },
    { label: 'Qualified Opportunities', count: qualified, color: '#16a34a', bg: '#dcfce7', id: 'Qualified' },
    { label: 'Lost / Closed', count: lost, color: '#dc2626', bg: '#fee2e2', id: 'Lost' }
  ];

  return (
    <div className="pipeline-dashboard-view">
      {/* 5 Top Level Metric Cards */}
      <StatCards
        stats={stats}
        currentStatusFilter="All"
        onSelectStatusFilter={(status) => {
          onNavigateToLeads(status);
        }}
        isLoading={isLoading}
      />

      {/* Grid of Analytical Breakdown Cards */}
      <div className="pipeline-analytics-grid">
        {/* Pipeline Stage Funnel & Conversion Rates */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-title-group">
              <TrendingUp size={18} className="analytics-header-icon" />
              <div>
                <h3 className="analytics-card-title">Pipeline Conversion & Stages</h3>
                <p className="analytics-card-subtitle">Distribution across active sales qualification stages</p>
              </div>
            </div>
            <div className="conversion-pill">
              <span className="conversion-rate-value">{conversionRate}%</span>
              <span className="conversion-rate-label">Win Rate</span>
            </div>
          </div>

          <div className="analytics-card-body">
            <div className="stage-progress-list">
              {stageBreakdown.map((stage) => {
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                return (
                  <div
                    key={stage.id}
                    className="stage-progress-item clickable-stage"
                    onClick={() => onNavigateToLeads(stage.id)}
                    title={`View ${stage.label} in Leads Directory`}
                  >
                    <div className="stage-progress-header">
                      <span className="stage-name">{stage.label}</span>
                      <span className="stage-count">
                        <strong>{stage.count}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="stage-track">
                      <div
                        className="stage-fill"
                        style={{ width: `${pct}%`, backgroundColor: stage.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pipeline-kpi-row">
              <div className="kpi-mini-card">
                <span className="kpi-mini-label">Active Prospects</span>
                <span className="kpi-mini-value">{activeLeadsCount}</span>
                <span className="kpi-mini-sub">{activeRate}% of pipeline</span>
              </div>
              <div className="kpi-mini-card">
                <span className="kpi-mini-label">Decided / Closed</span>
                <span className="kpi-mini-value">{qualified + lost}</span>
                <span className="kpi-mini-sub">{closedRate}% completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <div className="analytics-title-group">
              <Layers size={18} className="analytics-header-icon" />
              <div>
                <h3 className="analytics-card-title">Acquisition Channels</h3>
                <p className="analytics-card-subtitle">Incoming lead volume grouped by lead source</p>
              </div>
            </div>
          </div>

          <div className="analytics-card-body">
            <div className="sources-list">
              {LEAD_SOURCES.map((source) => {
                const count = sourceCounts[source] || 0;
                const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;

                return (
                  <div key={source} className="source-item">
                    <div className="source-info">
                      <span className="source-name">{source}</span>
                      <span className="source-count">{count} leads</span>
                    </div>
                    <div className="source-track">
                      <div
                        className="source-fill"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Snapshot */}
      <div className="recent-activity-section">
        <div className="recent-activity-header">
          <div>
            <h3 className="recent-activity-title">Recently Registered Prospects</h3>
            <p className="recent-activity-subtitle">Latest accounts added into your pipeline</p>
          </div>
          <div className="recent-header-actions">
            <button
              type="button"
              className="primary-btn btn-sm"
              onClick={onOpenCreateModal}
            >
              <UserPlus size={14} />
              Add Lead
            </button>
            <button
              type="button"
              className="secondary-btn btn-sm"
              onClick={() => onNavigateToLeads('All')}
            >
              <span>View All Leads</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {recentLeads.length === 0 ? (
          <div className="empty-recent-box">
            <p>No leads registered yet. Click "Add Lead" to get started.</p>
          </div>
        ) : (
          <div className="recent-leads-table-wrapper">
            <table className="recent-leads-table">
              <thead>
                <tr>
                  <th>Prospect</th>
                  <th>Contact</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id || lead._id}>
                    <td>
                      <div className="recent-name-cell">
                        <span className="recent-lead-name">{lead.name}</span>
                        <span className="recent-lead-company">
                          <Building size={11} />
                          {lead.company}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="recent-contact-cell">
                        <span className="recent-email">{lead.email}</span>
                        <span className="recent-phone">{lead.phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="source-tag">{lead.source}</span>
                    </td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td>
                      <span className="recent-date">{formatDate(lead.createdAt)}</span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="secondary-btn btn-sm"
                        onClick={() => onEditLead(lead)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
