/**
 * UserContext — global state for the user list and all CRUD operations.
 *
 * Assumptions:
 * - JSONPlaceholder does not persist changes, so we manage local state optimistically.
 * - New users are given a temporary ID based on timestamp to avoid collisions.
 */

import { createContext, useContext, useReducer, useCallback } from 'react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../api/userApi';

// ─── State Shape ─────────────────────────────────────────────────────────────
const initialState = {
  users: [],
  loading: false,
  error: null,
};

// ─── Action Types ─────────────────────────────────────────────────────────────
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  ADD_USER: 'ADD_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
const userReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };

    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, users: action.payload };

    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTIONS.ADD_USER:
      // Prepend the new user so it appears at the top of the list
      return { ...state, users: [action.payload, ...state.users] };

    case ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        ),
      };

    case ACTIONS.DELETE_USER:
      return {
        ...state,
        users: state.users.filter((u) => u.id !== action.payload),
      };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

// ─── Context ─────────────────────────────────────────────────────────────────
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  /** Load all users from the API. */
  const loadUsers = useCallback(async () => {
    dispatch({ type: ACTIONS.FETCH_START });
    try {
      const data = await fetchUsers();
      dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data });
    } catch (err) {
      dispatch({
        type: ACTIONS.FETCH_ERROR,
        payload: err.message || 'Failed to fetch users. Please try again.',
      });
    }
  }, []);

  /** Add a new user. On success, optimistically update local state. */
  const addUser = useCallback(async (userData) => {
    const created = await createUser(userData);
    // JSONPlaceholder always returns id=11; use a timestamp to keep IDs unique locally
    const localUser = {
      ...userData,
      id: Date.now(),
      company: { name: userData.department },
    };
    dispatch({ type: ACTIONS.ADD_USER, payload: localUser });
    return localUser;
  }, []);

  /** Edit an existing user in place. */
  const editUser = useCallback(async (id, userData) => {
    await updateUser(id, userData);
    const updated = {
      ...userData,
      id,
      company: { name: userData.department },
    };
    dispatch({ type: ACTIONS.UPDATE_USER, payload: updated });
    return updated;
  }, []);

  /** Remove a user by ID. */
  const removeUser = useCallback(async (id) => {
    await deleteUser(id);
    dispatch({ type: ACTIONS.DELETE_USER, payload: id });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  return (
    <UserContext.Provider
      value={{ ...state, loadUsers, addUser, editUser, removeUser, clearError }}
    >
      {children}
    </UserContext.Provider>
  );
};

/** Hook for consuming the user context. */
export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUsers must be used inside <UserProvider>');
  return ctx;
};
