/**
 * Tests for src/utils/userHelpers.js
 * Covers search, filter, sort, and pagination helpers.
 */

import { describe, it, expect } from 'vitest';
import {
  filterBySearch,
  filterByFilters,
  sortUsers,
  paginateUsers,
  getTotalPages,
} from '../utils/userHelpers';

const MOCK_USERS = [
  { id: 1, name: 'Leanne Graham', username: 'lgraham', email: 'leanne@test.com', phone: '111', company: { name: 'Engineering' } },
  { id: 2, name: 'Ervin Howell', username: 'ehowell', email: 'ervin@test.com', phone: '222', company: { name: 'Marketing' } },
  { id: 3, name: 'Clementine Bauch', username: 'cbauch', email: 'clem@test.com', phone: '333', company: { name: 'Engineering' } },
  { id: 4, name: 'Patricia Lebsack', username: 'plebsack', email: 'pat@test.com', phone: '444', company: { name: 'Finance' } },
];

// ─── filterBySearch ───────────────────────────────────────────────────────────
describe('filterBySearch', () => {
  it('returns all users when query is empty', () => {
    expect(filterBySearch(MOCK_USERS, '')).toHaveLength(MOCK_USERS.length);
  });

  it('matches by name (case-insensitive)', () => {
    const result = filterBySearch(MOCK_USERS, 'leanne');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Leanne Graham');
  });

  it('matches by email', () => {
    const result = filterBySearch(MOCK_USERS, 'ervin@test');
    expect(result).toHaveLength(1);
    expect(result[0].email).toBe('ervin@test.com');
  });

  it('matches by username', () => {
    const result = filterBySearch(MOCK_USERS, 'cbauch');
    expect(result).toHaveLength(1);
  });

  it('returns empty array when nothing matches', () => {
    expect(filterBySearch(MOCK_USERS, 'zzzzz')).toHaveLength(0);
  });
});

// ─── filterByFilters ──────────────────────────────────────────────────────────
describe('filterByFilters', () => {
  const emptyFilters = { firstName: '', lastName: '', email: '', department: '' };

  it('returns all users when no filters are active', () => {
    expect(filterByFilters(MOCK_USERS, emptyFilters)).toHaveLength(MOCK_USERS.length);
  });

  it('filters by department', () => {
    const result = filterByFilters(MOCK_USERS, { ...emptyFilters, department: 'Engineering' });
    expect(result).toHaveLength(2);
    result.forEach((u) => expect(u.company.name).toBe('Engineering'));
  });

  it('filters by first name', () => {
    const result = filterByFilters(MOCK_USERS, { ...emptyFilters, firstName: 'Patricia' });
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Patricia Lebsack');
  });

  it('applies multiple filters with AND logic', () => {
    const result = filterByFilters(MOCK_USERS, {
      ...emptyFilters,
      firstName: 'Leanne',
      department: 'Marketing', // Leanne is in Engineering, not Marketing
    });
    expect(result).toHaveLength(0);
  });
});

// ─── sortUsers ────────────────────────────────────────────────────────────────
describe('sortUsers', () => {
  it('sorts by name ascending', () => {
    const sorted = sortUsers(MOCK_USERS, 'name', 'asc');
    expect(sorted[0].name).toBe('Clementine Bauch');
    expect(sorted[sorted.length - 1].name).toBe('Patricia Lebsack');
  });

  it('sorts by name descending', () => {
    const sorted = sortUsers(MOCK_USERS, 'name', 'desc');
    expect(sorted[0].name).toBe('Patricia Lebsack');
  });

  it('sorts by nested field (company.name)', () => {
    const sorted = sortUsers(MOCK_USERS, 'company.name', 'asc');
    expect(sorted[0].company.name).toBe('Engineering');
    expect(sorted[sorted.length - 1].company.name).toBe('Marketing');
  });

  it('does not mutate the original array', () => {
    const copy = [...MOCK_USERS];
    sortUsers(MOCK_USERS, 'name', 'asc');
    expect(MOCK_USERS).toEqual(copy);
  });
});

// ─── paginateUsers & getTotalPages ────────────────────────────────────────────
describe('paginateUsers', () => {
  const users = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));

  it('returns the first page correctly', () => {
    const page = paginateUsers(users, 1, 10);
    expect(page).toHaveLength(10);
    expect(page[0].id).toBe(1);
  });

  it('returns a partial last page', () => {
    const page = paginateUsers(users, 3, 10);
    expect(page).toHaveLength(5);
    expect(page[0].id).toBe(21);
  });
});

describe('getTotalPages', () => {
  it('calculates pages correctly', () => {
    expect(getTotalPages(10, 10)).toBe(1);
    expect(getTotalPages(11, 10)).toBe(2);
    expect(getTotalPages(25, 10)).toBe(3);
    expect(getTotalPages(0, 10)).toBe(0);
  });
});
