/**
 * Dashboard — the primary view of the User Management application.
 *
 * Responsibilities:
 * - Owns modal/dialog open state (form, confirm delete)
 * - Delegates data operations to UserContext
 * - Delegates table state (filter/sort/paginate) to useUserTable
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { Search, Plus, SlidersHorizontal, RefreshCw, Users } from 'lucide-react';
import { useUsers } from '../context/UserContext';
import { useUserTable } from '../hooks/useUserTable';
import { UserTable } from '../components/users/UserTable';
import { UserFormModal } from '../components/users/UserFormModal';
import { FilterPopup } from '../components/users/FilterPopup';
import { Pagination } from '../components/common/Pagination';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Toast } from '../components/common/Toast';

export const Dashboard = () => {
  const { users, loading, error, loadUsers, addUser, editUser, removeUser, clearError } =
    useUsers();

  // ─── Table state ───────────────────────────────────────────────────────────
  const {
    searchQuery,
    handleSearch,
    filters,
    updateFilter,
    clearFilters,
    isAnyFilterActive,
    sort,
    handleSort,
    page,
    setPage,
    pageSize,
    handlePageSizeChange,
    paginatedUsers,
    totalPages,
    totalCount,
  } = useUserTable(users);

  // ─── UI state ──────────────────────────────────────────────────────────────
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const filterButtonRef = useRef(null);

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ─── Toast helpers ─────────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  // ─── CRUD handlers ─────────────────────────────────────────────────────────
  const handleOpenAdd = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (user) => {
    setDeletingUser(user);
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingUser) {
        await editUser(editingUser.id, formData);
        showToast(`${formData.name} has been updated.`);
      } else {
        await addUser(formData);
        showToast(`${formData.name} has been added.`);
      }
      setIsFormOpen(false);
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser) return;
    setDeleteLoading(true);
    try {
      await removeUser(deletingUser.id);
      showToast(`${deletingUser.name} has been removed.`);
      setDeletingUser(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete user.', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                User Management
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Manage your team members
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAdd}
            className="btn-primary shrink-0"
            aria-label="Add new user"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add User</span>
          </button>
        </div>
      </header>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* API error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => { clearError(); loadUsers(); }}
                className="text-xs text-red-700 underline hover:no-underline flex items-center gap-1"
              >
                <RefreshCw size={12} /> Retry
              </button>
              <button onClick={clearError} className="text-xs text-red-500 hover:text-red-700">
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Search + Filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, email, or username…"
              className="input-field pl-9"
              aria-label="Search users"
            />
          </div>

          {/* Filter toggle */}
          <div className="relative" ref={filterButtonRef}>
            <button
              onClick={() => setIsFilterOpen((o) => !o)}
              className={`btn-secondary relative ${isAnyFilterActive ? 'border-blue-500 text-blue-600' : ''}`}
              aria-expanded={isFilterOpen}
              aria-haspopup="dialog"
            >
              <SlidersHorizontal size={16} />
              Filters
              {isAnyFilterActive && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                  {Object.values(filters).filter((v) => v.trim()).length}
                </span>
              )}
            </button>

            <FilterPopup
              isOpen={isFilterOpen}
              filters={filters}
              onFilterChange={updateFilter}
              onClear={clearFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Refresh button */}
          <button
            onClick={loadUsers}
            className="btn-secondary"
            aria-label="Refresh user list"
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>
            <span className="font-semibold text-gray-800">{totalCount}</span> users
            {isAnyFilterActive && ' matching filters'}
          </span>
          {isAnyFilterActive && (
            <button
              onClick={clearFilters}
              className="text-blue-600 text-xs hover:underline ml-1"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Data table */}
        <UserTable
          users={paginatedUsers}
          loading={loading}
          sort={sort}
          onSort={handleSort}
          onEdit={handleOpenEdit}
          onDelete={handleOpenDelete}
        />

        {/* Pagination */}
        {!loading && totalCount > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
      </main>

      {/* ── Modals & overlays ──────────────────────────────────────────────── */}
      <UserFormModal
        isOpen={isFormOpen}
        user={editingUser}
        onSubmit={handleFormSubmit}
        onClose={() => setIsFormOpen(false)}
        isLoading={formLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingUser)}
        title="Delete User"
        message={`Are you sure you want to remove ${deletingUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingUser(null)}
        isLoading={deleteLoading}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={dismissToast}
        />
      )}
    </div>
  );
};
