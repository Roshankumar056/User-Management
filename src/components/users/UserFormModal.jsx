/**
 * UserFormModal — modal drawer for creating or editing a user.
 *
 * Assumptions:
 * - "Department" maps to company.name from the JSONPlaceholder schema.
 * - Full name is stored as a single `name` field; we split on first space for display.
 * - Website is optional; other fields are required.
 */

import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import { validateUserForm } from '../../utils/validation';

const EMPTY_FORM = {
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  department: '',
};

/**
 * Flatten a user object from the API into our flat form shape.
 * @param {User|null} user
 * @returns {Object} flat form data
 */
const toFormData = (user) => {
  if (!user) return EMPTY_FORM;
  return {
    name: user.name || '',
    username: user.username || '',
    email: user.email || '',
    phone: user.phone || '',
    website: user.website || '',
    department: user.company?.name || user.department || '',
  };
};

export const UserFormModal = ({ isOpen, user, onSubmit, onClose, isLoading }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const isEditing = Boolean(user);

  // Populate form when editing an existing user, or reset for new user
  useEffect(() => {
    if (isOpen) {
      setFormData(toFormData(user));
      setErrors({});
      setTouched({});
    }
  }, [isOpen, user]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Re-validate the changed field if it was already touched
    if (touched[field]) {
      const newErrors = validateUserForm({ ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateUserForm(formData);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mark all fields as touched so errors show
    const allTouched = Object.keys(EMPTY_FORM).reduce(
      (acc, k) => ({ ...acc, [k]: true }),
      {}
    );
    setTouched(allTouched);

    const validationErrors = validateUserForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="text-blue-600" size={18} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit User' : 'Add New User'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
          <FormField
            id="name"
            label="Full Name"
            required
            value={formData.name}
            error={touched.name && errors.name}
            onChange={(v) => handleChange('name', v)}
            onBlur={() => handleBlur('name')}
            placeholder="Leanne Graham"
          />

          <FormField
            id="username"
            label="Username"
            required
            value={formData.username}
            error={touched.username && errors.username}
            onChange={(v) => handleChange('username', v)}
            onBlur={() => handleBlur('username')}
            placeholder="lgraham"
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            required
            value={formData.email}
            error={touched.email && errors.email}
            onChange={(v) => handleChange('email', v)}
            onBlur={() => handleBlur('email')}
            placeholder="leanne@example.com"
          />

          <FormField
            id="phone"
            label="Phone"
            required
            value={formData.phone}
            error={touched.phone && errors.phone}
            onChange={(v) => handleChange('phone', v)}
            onBlur={() => handleBlur('phone')}
            placeholder="1-770-736-8031"
          />

          <FormField
            id="department"
            label="Department"
            required
            value={formData.department}
            error={touched.department && errors.department}
            onChange={(v) => handleChange('department', v)}
            onBlur={() => handleBlur('department')}
            placeholder="Engineering"
          />

          <FormField
            id="website"
            label="Website"
            value={formData.website}
            error={touched.website && errors.website}
            onChange={(v) => handleChange('website', v)}
            onBlur={() => handleBlur('website')}
            placeholder="hildegard.org (optional)"
          />

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving…' : isEditing ? 'Save Changes' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/** Reusable labeled input with inline error display. */
const FormField = ({
  id,
  label,
  required,
  type = 'text',
  value,
  error,
  onChange,
  onBlur,
  placeholder,
}) => (
  <div>
    <label htmlFor={id} className="label">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`input-field ${error ? 'border-red-400 focus:ring-red-400' : ''}`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
    />
    {error && (
      <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
);
