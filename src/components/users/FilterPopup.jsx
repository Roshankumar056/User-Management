/**
 * FilterPopup — slide-down panel for narrowing users by field-level criteria.
 * Supports firstName, lastName, email, and department (company name).
 */

import { useRef, useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

const FILTER_FIELDS = [
  { key: 'firstName', label: 'First Name', placeholder: 'e.g. Leanne' },
  { key: 'lastName', label: 'Last Name', placeholder: 'e.g. Graham' },
  { key: 'email', label: 'Email', placeholder: 'e.g. leanne@example.com' },
  { key: 'department', label: 'Department', placeholder: 'e.g. Romaguera' },
];

export const FilterPopup = ({ isOpen, filters, onFilterChange, onClear, onClose }) => {
  const ref = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasActiveFilters = Object.values(filters).some((v) => v.trim() !== '');

  return (
    <div
      ref={ref}
      className="absolute top-full mt-2 right-0 z-30 bg-white border border-gray-200 rounded-2xl shadow-xl w-80 p-5"
      role="dialog"
      aria-label="Filter users"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-800">Filter Users</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Close filter panel"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        {FILTER_FIELDS.map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="label" htmlFor={`filter-${key}`}>
              {label}
            </label>
            <input
              id={`filter-${key}`}
              type="text"
              value={filters[key]}
              onChange={(e) => onFilterChange(key, e.target.value)}
              placeholder={placeholder}
              className="input-field"
            />
          </div>
        ))}
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="mt-4 w-full btn-secondary justify-center"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};
