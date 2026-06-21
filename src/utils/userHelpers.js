/**
 * Utility helpers for filtering, sorting, and paginating user arrays.
 * All functions are pure — they do not mutate their inputs.
 */

/**
 * Extract a nested field value from a user using dot notation.
 * e.g. getNestedValue(user, 'address.city') → user.address.city
 * @param {Object} obj
 * @param {string} path - dot-separated key path
 * @returns {*}
 */
export const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => acc?.[key], obj);

/**
 * Filter an array of users against a text search query.
 * Matches against name, email, username, and company name.
 * @param {User[]} users
 * @param {string} query
 * @returns {User[]}
 */
export const filterBySearch = (users, query) => {
  if (!query?.trim()) return users;
  const lower = query.toLowerCase();
  return users.filter(
    (u) =>
      u.name?.toLowerCase().includes(lower) ||
      u.email?.toLowerCase().includes(lower) ||
      u.username?.toLowerCase().includes(lower) ||
      u.company?.name?.toLowerCase().includes(lower)
  );
};

/**
 * Filter users by popup filter criteria (firstName, lastName, email, department).
 * All active filter values must match (AND logic).
 * @param {User[]} users
 * @param {Object} filters - { firstName, lastName, email, department }
 * @returns {User[]}
 */
export const filterByFilters = (users, filters) => {
  return users.filter((user) => {
    const [firstName = '', lastName = ''] = (user.name || '').split(' ');
    const department = user.company?.name || '';

    if (
      filters.firstName &&
      !firstName.toLowerCase().includes(filters.firstName.toLowerCase())
    )
      return false;

    if (
      filters.lastName &&
      !lastName.toLowerCase().includes(filters.lastName.toLowerCase())
    )
      return false;

    if (
      filters.email &&
      !user.email?.toLowerCase().includes(filters.email.toLowerCase())
    )
      return false;

    if (
      filters.department &&
      !department.toLowerCase().includes(filters.department.toLowerCase())
    )
      return false;

    return true;
  });
};

/**
 * Sort an array of users by a given field and direction.
 * Supports dot-notation for nested fields (e.g. 'company.name').
 * @param {User[]} users
 * @param {string} field
 * @param {'asc'|'desc'} direction
 * @returns {User[]}
 */
export const sortUsers = (users, field, direction) => {
  if (!field) return users;

  return [...users].sort((a, b) => {
    let valA = getNestedValue(a, field);
    let valB = getNestedValue(b, field);

    if (field === 'id') {
      return direction === 'asc'
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    }

    valA = String(valA ?? '').toLowerCase();
    valB = String(valB ?? '').toLowerCase();

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;

    return 0;
  });
};
/**
 * Slice a user array for the current pagination page.
 * @param {User[]} users
 * @param {number} page - 1-indexed
 * @param {number} pageSize
 * @returns {User[]}
 */
export const paginateUsers = (users, page, pageSize) => {
  const start = (page - 1) * pageSize;
  return users.slice(start, start + pageSize);
};

/**
 * Calculate total page count.
 * @param {number} total
 * @param {number} pageSize
 * @returns {number}
 */
export const getTotalPages = (total, pageSize) => Math.ceil(total / pageSize);
