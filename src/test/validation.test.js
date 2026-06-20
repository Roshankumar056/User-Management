/**
 * Tests for src/utils/validation.js
 * Covers required, email, URL, and full-form validation.
 */

import { describe, it, expect } from 'vitest';
import {
  validateRequired,
  validateEmail,
  validateUrl,
  validateUserForm,
} from '../utils/validation';

describe('validateRequired', () => {
  it('returns an error when value is empty', () => {
    expect(validateRequired('', 'Name')).toBe('Name is required.');
  });

  it('returns an error when value is only whitespace', () => {
    expect(validateRequired('   ', 'Name')).toBe('Name is required.');
  });

  it('returns empty string for a valid value', () => {
    expect(validateRequired('Leanne', 'Name')).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns error for empty string', () => {
    expect(validateEmail('')).toBeTruthy();
  });

  it('returns error for malformed email', () => {
    expect(validateEmail('not-an-email')).toBeTruthy();
    expect(validateEmail('missing@domain')).toBeTruthy();
    expect(validateEmail('@nodomain.com')).toBeTruthy();
  });

  it('returns empty string for valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe('');
  });
});

describe('validateUrl', () => {
  it('returns empty string when URL is empty (optional field)', () => {
    expect(validateUrl('')).toBe('');
    expect(validateUrl('   ')).toBe('');
  });

  it('returns error for a clearly invalid URL', () => {
    expect(validateUrl('not a url')).toBeTruthy();
  });

  it('accepts valid URLs with or without protocol', () => {
    expect(validateUrl('https://example.com')).toBe('');
    expect(validateUrl('hildegard.org')).toBe('');
  });
});

describe('validateUserForm', () => {
  const validForm = {
    name: 'Leanne Graham',
    username: 'lgraham',
    email: 'leanne@example.com',
    phone: '1-770-736-8031',
    department: 'Engineering',
    website: '',
  };

  it('returns no errors for a fully valid form', () => {
    const errors = validateUserForm(validForm);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('returns an error for each missing required field', () => {
    const errors = validateUserForm({
      name: '',
      username: '',
      email: '',
      phone: '',
      department: '',
      website: '',
    });
    expect(errors.name).toBeTruthy();
    expect(errors.username).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.department).toBeTruthy();
  });

  it('includes email format error when email is malformed', () => {
    const errors = validateUserForm({ ...validForm, email: 'bad-email' });
    expect(errors.email).toBeTruthy();
  });

  it('includes website error when URL is invalid', () => {
    const errors = validateUserForm({ ...validForm, website: 'not a url' });
    expect(errors.website).toBeTruthy();
  });

  it('does not flag website when it is valid', () => {
    const errors = validateUserForm({ ...validForm, website: 'https://example.com' });
    expect(errors.website).toBeUndefined();
  });
});
