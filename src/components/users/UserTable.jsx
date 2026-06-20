/**
 * UserTable — renders the user data grid with sortable column headers.
 * Shows a skeleton loader while data is loading, and an empty state
 * when no users match the current filter/search.
 */

import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';

const COLUMNS = [
  { key: 'id', label: 'ID', width: 'w-12' },
  { key: 'name', label: 'Full Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'company.name', label: 'Department' },
  { key: 'phone', label: 'Phone' },
];

export const UserTable = ({
  users,
  loading,
  sort,
  onSort,
  onEdit,
  onDelete,
}) => {
  if (loading) return <SkeletonTable />;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm border-collapse" aria-label="Users">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {COLUMNS.map((col) => (
              <SortableHeader
                key={col.key}
                column={col}
                sort={sort}
                onSort={onSort}
              />
            ))}
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <EmptyRow colSpan={COLUMNS.length + 1} />
          ) : (
            users.map((user, idx) => (
              <UserRow
                key={user.id}
                user={user}
                isEven={idx % 2 === 0}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

/** Column header with sort indicator icon. */
const SortableHeader = ({ column, sort, onSort }) => {
  const isActive = sort.field === column.key;
  const Icon = isActive
    ? sort.direction === 'asc'
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown;

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
        cursor-pointer select-none group
        ${isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-500 hover:bg-gray-100'}
        transition-colors ${column.width ?? ''}`}
      onClick={() => onSort(column.key)}
      aria-sort={
        isActive ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      <span className="flex items-center gap-1">
        {column.label}
        <Icon
          size={13}
          className={`opacity-50 group-hover:opacity-100 transition-opacity
            ${isActive ? 'opacity-100 text-blue-600' : ''}`}
        />
      </span>
    </th>
  );
};

/** Individual user row with edit/delete action buttons. */
const UserRow = ({ user, isEven, onEdit, onDelete }) => {
  const department = user.company?.name || user.department || '—';
  const [first, ...rest] = (user.name || '').split(' ');

  return (
    <tr
      className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors
        ${isEven ? 'bg-white' : 'bg-gray-50/40'}`}
    >
      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{user.id}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          {/* Avatar initials */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ backgroundColor: avatarColor(user.name), color: '#fff' }}
            aria-hidden="true"
          >
            {(user.name || '?')[0].toUpperCase()}
          </div>
          <span className="font-medium text-gray-900 whitespace-nowrap">{user.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-600">@{user.username}</td>
      <td className="px-4 py-3 text-gray-600 lowercase">{user.email}</td>
      <td className="px-4 py-3">
        <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {department}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{user.phone}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <ActionButton
            onClick={() => onEdit(user)}
            icon={<Pencil size={14} />}
            label={`Edit ${user.name}`}
            colorClass="hover:text-blue-600 hover:bg-blue-50"
          />
          <ActionButton
            onClick={() => onDelete(user)}
            icon={<Trash2 size={14} />}
            label={`Delete ${user.name}`}
            colorClass="hover:text-red-600 hover:bg-red-50"
          />
        </div>
      </td>
    </tr>
  );
};

/** Icon-only action button with accessible label. */
const ActionButton = ({ onClick, icon, label, colorClass }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`p-1.5 rounded-lg text-gray-400 transition-colors ${colorClass}`}
  >
    {icon}
  </button>
);

/** Shown when the filtered result set is empty. */
const EmptyRow = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="py-16 text-center">
      <p className="text-gray-400 text-sm">No users match your search or filters.</p>
      <p className="text-gray-300 text-xs mt-1">Try adjusting your criteria.</p>
    </td>
  </tr>
);

/** Animated placeholder rows shown while data is loading. */
const SkeletonTable = () => (
  <div className="overflow-x-auto rounded-xl border border-gray-200">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {['ID', 'Full Name', 'Username', 'Email', 'Department', 'Phone', 'Actions'].map(
            (h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {h}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 8 }).map((_, i) => (
          <tr key={i} className="border-b border-gray-100">
            {Array.from({ length: 7 }).map((_, j) => (
              <td key={j} className="px-4 py-3">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Deterministic pastel color from a user's name string.
 * Uses the char code sum to pick a hue, keeping saturation/lightness fixed.
 */
const avatarColor = (name = '') => {
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `hsl(${hue}, 60%, 45%)`;
};
