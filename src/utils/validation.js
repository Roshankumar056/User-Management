/**
 * Client-side validation utilities for user form fields.
 * Each validator returns an error string or empty string if valid.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate that a required text field is not empty.
 * @param {string} value
 * @param {string} fieldName
 * @returns {string} error message or empty string
 */
export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return `${fieldName} is required.`;
  }
  return '';
};

/**
 * Validate email format.
 * @param {string} email
 * @returns {string} error message or empty string
 */
export const validateEmail = (email) => {
  const requiredError = validateRequired(email, 'Email');
  if (requiredError) return requiredError;
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
  return '';
};

/**
 * Validate a URL (optional field — only checks format if value is present).
 * @param {string} url
 * @returns {string} error message or empty string
 */
export const validateUrl = (url) => {
  if (!url || url.trim() === '') return ''; // optional
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return '';
  } catch {
    return 'Please enter a valid website URL.';
  }
};

/**
 * Validate all user form fields at once.
 * @param {Object} formData
 * @returns {Object} errors keyed by field name
 */
export const validateUserForm = (formData) => {
  const errors = {};

  const nameError = validateRequired(formData.name, 'Full name');
  if (nameError) errors.name = nameError;

  const usernameError = validateRequired(formData.username, 'Username');
  if (usernameError) errors.username = usernameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const deptError = validateRequired(formData.department, 'Department');
  if (deptError) errors.department = deptError;

  const phoneError = validateRequired(formData.phone, 'Phone');
  if (phoneError) errors.phone = phoneError;

  const websiteError = validateUrl(formData.website);
  if (websiteError) errors.website = websiteError;

  return errors;
};
