/**
 * User API Service
 * Wraps all HTTP interactions with the JSONPlaceholder /users endpoint.
 * JSONPlaceholder simulates responses for POST/PUT/DELETE without persisting data.
 */

import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch all users from the API.
 * @returns {Promise<User[]>}
 */
export const fetchUsers = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

/**
 * Fetch a single user by ID.
 * @param {number} id
 * @returns {Promise<User>}
 */
export const fetchUserById = async (id) => {
  const response = await apiClient.get(`/users/${id}`);
  return response.data;
};

/**
 * Create a new user. JSONPlaceholder simulates a successful create
 * and returns the new user with a fake ID (always 11).
 * @param {Partial<User>} userData
 * @returns {Promise<User>}
 */
export const createUser = async (userData) => {
  const response = await apiClient.post('/users', userData);
  return response.data;
};

/**
 * Update an existing user by ID.
 * @param {number} id
 * @param {Partial<User>} userData
 * @returns {Promise<User>}
 */
export const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/users/${id}`, userData);
  return response.data;
};

/**
 * Delete a user by ID. JSONPlaceholder returns an empty object on success.
 * @param {number} id
 * @returns {Promise<{}>}
 */
export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/users/${id}`);
  return response.data;
};
