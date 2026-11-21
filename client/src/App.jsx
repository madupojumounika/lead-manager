import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from './services/api.js';
import { useToast } from './hooks/useToast.js';
import { Sidebar } from './components/Layout/Sidebar.jsx';
import { Header } from './components/Layout/Header.jsx';
import { StatCards } from './components/Dashboard/StatCards.jsx';
import { SearchFilterBar } from './components/UI/SearchFilterBar.jsx';
import { LeadTable } from './components/Leads/LeadTable.jsx';
import { Pagination } from './components/UI/Pagination.jsx';
import { LeadModal } from './components/Leads/LeadModal.jsx';
import { DeleteConfirmModal } from './components/Leads/DeleteConfirmModal.jsx';
import { ToastContainer } from './components/UI/Toast.jsx';

export default function App() {
  // Navigation & Layout
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('leads');

  // Leads Data & Pagination
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Dashboard Stats
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0
  });

  // Query & Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Loading States
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isDeletingLead, setIsDeletingLead] = useState(false);
  const [apiHealthy, setApiHealthy] = useState(true);

  // Modals State
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLead, setDeletingLead] = useState(null);

  // Toast System
  const { toasts, removeToast, toastSuccess, toastError, toastInfo } = useToast();

  // Search input debounce timer
  const searchTimerRef = useRef(null);

  const handleSearchChange = (val) => {
    setSearch(val);
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(val);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
  };

  // Fetch Leads from API
  const fetchLeads = useCallback(async () => {
    setIsLoadingLeads(true);
    try {
      const response = await api.getLeads({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearch,
        status: statusFilter,
        source: sourceFilter,
        sortBy,
        sortOrder
      });

      if (response && response.success) {
        setLeads(response.data || []);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      toastError(err.message || 'Unable to load leads. Please check backend connection.');
    } finally {
      setIsLoadingLeads(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    statusFilter,
    sourceFilter,
    sortBy,
    sortOrder,
    toastError
  ]);

  // Fetch Dashboard Stats
  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await api.getDashboardStats();
      if (response && response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard statistics:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Check Health on Mount
  useEffect(() => {
    api
      .checkHealth()
      .then(() => setApiHealthy(true))
      .catch(() => setApiHealthy(false));
  }, []);

  // Fetch leads when dependencies change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingLead(null);
    setIsLeadModalOpen(true);
  };

  const handleOpenEditModal = (lead) => {
    setEditingLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleOpenDeleteModal = (lead) => {
    setDeletingLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleLeadFormSubmit = async (formData, setFieldErrors) => {
    setIsSubmittingLead(true);
    try {
      if (editingLead) {
        const leadId = editingLead.id || editingLead._id;
        await api.updateLead(leadId, formData);
        toastSuccess(`Lead for "${formData.name}" updated successfully.`);
      } else {
        await api.createLead(formData);
        toastSuccess(`New lead for "${formData.name}" created successfully.`);
      }

      setIsLeadModalOpen(false);
      setEditingLead(null);
      fetchLeads();
      fetchStats();
    } catch (err) {
      console.error('Lead form submission error:', err);
      if (err.errors && Array.isArray(err.errors)) {
        const mappedErrors = {};
        err.errors.forEach((e) => {
          mappedErrors[e.field] = e.message;
        });
        setFieldErrors(mappedErrors);
      } else {
        setFieldErrors({ general: err.message || 'Failed to save lead' });
      }
      toastError(err.message || 'Could not save lead details.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingLead) return;
    setIsDeletingLead(true);
    const leadId = deletingLead.id || deletingLead._id;
    const leadName = deletingLead.name;

    try {
      await api.deleteLead(leadId);
      toastSuccess(`Lead "${leadName}" was permanently removed.`);
      setIsDeleteModalOpen(false);
      setDeletingLead(null);

      // Adjust page if this was the last item on current page
      if (leads.length === 1 && pagination.page > 1) {
        setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchLeads();
      }
      fetchStats();
    } catch (err) {
      console.error('Delete error:', err);
      toastError(err.message || 'Failed to delete lead.');
    } finally {
      setIsDeletingLead(false);
    }
  };

  const handleQuickStatusChange = async (leadId, newStatus) => {
    try {
      await api.updateLeadStatus(leadId, newStatus);
      toastSuccess(`Status updated to ${newStatus}`);
      fetchLeads();
      fetchStats();
    } catch (err) {
      console.error('Quick status update error:', err);
      toastError(err.message || 'Failed to update status.');
    }
  };

  const handleSelectStatusFilter = (status) => {
    setStatusFilter(status);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('All');
    setSourceFilter('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPagination((prev) => ({ ...prev, page: 1 }));
    toastInfo('Filters have been reset.');
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />

      {/* Main App Container */}
      <div className="app-main">
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onOpenCreateModal={handleOpenCreateModal}
          apiHealthy={apiHealthy}
        />

        <main className="app-content">
          {/* Dashboard Summary Stat Cards */}
          <StatCards
            stats={stats}
            currentStatusFilter={statusFilter}
            onSelectStatusFilter={handleSelectStatusFilter}
            isLoading={isLoadingStats}
          />

          {/* Search, Filter, Sort Toolbar */}
          <SearchFilterBar
            search={search}
            onSearchChange={handleSearchChange}
            status={statusFilter}
            onStatusChange={(st) => {
              setStatusFilter(st);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            source={sourceFilter}
            onSourceChange={(src) => {
              setSourceFilter(src);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
            onRefresh={() => {
              fetchLeads();
              fetchStats();
            }}
            isLoading={isLoadingLeads}
          />

          {/* Leads Listing Table */}
          <LeadTable
            leads={leads}
            isLoading={isLoadingLeads}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            onEditLead={handleOpenEditModal}
            onDeleteLead={handleOpenDeleteModal}
            onStatusQuickChange={handleQuickStatusChange}
            onOpenCreateModal={handleOpenCreateModal}
            onResetFilters={handleResetFilters}
            hasFilters={Boolean(
              debouncedSearch ||
              (statusFilter && statusFilter !== 'All') ||
              (sourceFilter && sourceFilter !== 'All')
            )}
          />

          {/* Pagination Controls */}
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </main>
      </div>

      {/* Create / Edit Modal */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => {
          if (!isSubmittingLead) {
            setIsLeadModalOpen(false);
            setEditingLead(null);
          }
        }}
        onSubmit={handleLeadFormSubmit}
        initialData={editingLead}
        isSubmitting={isSubmittingLead}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        lead={deletingLead}
        onClose={() => {
          if (!isDeletingLead) {
            setIsDeleteModalOpen(false);
            setDeletingLead(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeletingLead}
      />
    </div>
  );
}
