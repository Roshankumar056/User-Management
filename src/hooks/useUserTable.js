/**
 * useUserTable — encapsulates all table-level state:
 * search, filters, sort, and pagination.
 *
 * Keeps the Dashboard component lean by separating display logic.
 */

import { useState, useMemo } from 'react';
import {
  filterBySearch,
  filterByFilters,
  sortUsers,
  paginateUsers,
  getTotalPages,
} from '../utils/userHelpers';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT = { field: 'id', direction: 'asc' };
const DEFAULT_FILTERS = { firstName: '', lastName: '', email: '', department: '' };

export const useUserTable = (users) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  /** Toggle sort direction if same field; switch field otherwise. */
  const handleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { field, direction: 'asc' }
    );
    setPage(1);
  };

  /** Update a single filter key, reset page. */
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  /** Clear all active filters. */
  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const isAnyFilterActive = Object.values(filters).some((v) => v.trim() !== '');

  /** Full processing pipeline: filter → sort → paginate. */
  const { processedUsers, paginatedUsers, totalPages } = useMemo(() => {
    const afterSearch = filterBySearch(users, searchQuery);
    const afterFilters = filterByFilters(afterSearch, filters);
    const afterSort = sortUsers(afterFilters, sort.field, sort.direction);
    const totalPages = getTotalPages(afterSort.length, pageSize);
    const safePageSize = typeof pageSize === 'number' ? pageSize : afterSort.length;
    const paginated = paginateUsers(afterSort, page, safePageSize);
    return { processedUsers: afterSort, paginatedUsers: paginated, totalPages };
  }, [users, searchQuery, filters, sort, page, pageSize]);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setPage(1);
  };

  return {
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
    processedUsers,
    paginatedUsers,
    totalPages,
    totalCount: processedUsers.length,
  };
};
