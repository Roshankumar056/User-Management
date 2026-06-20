# User Management Dashboard

A fully-featured React + Tailwind CSS application for managing users via the [JSONPlaceholder](https://jsonplaceholder.typicode.com) mock REST API.

## Features

| Feature | Details |
|---|---|
| **View** | Fetches all 10 users from `/users` on mount |
| **Add** | POST to `/users`; new user appears at top of list optimistically |
| **Edit** | PUT to `/users/:id`; changes reflected immediately |
| **Delete** | DELETE to `/users/:id`; confirm dialog prevents accidents |
| **Search** | Real-time full-text search across name, email, username |
| **Filter** | Popup to filter by first name, last name, email, department |
| **Sort** | Click any column header to sort ascending/descending |
| **Pagination** | Page-size selector (10 / 25 / 50 / 100) with page navigation |
| **Validation** | Client-side form validation with per-field inline errors |
| **Error handling** | API errors shown as dismissible banners with retry |
| **Toast feedback** | Success/error notifications on every CRUD action |
| **Responsive** | Mobile-first layout, sticky header, overflow-scroll table |

## Tech Stack

- **React 18** + **Vite** — fast dev/build tooling
- **Tailwind CSS 3** — utility-first styling
- **Axios** — HTTP client with timeout handling
- **Lucide React** — consistent icon set
- **Vitest** + **Testing Library** — unit testing

## Project Structure

```
src/
├── api/
│   └── userApi.js          # All HTTP calls (fetch, create, update, delete)
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.jsx  # Reusable destructive action confirm modal
│   │   ├── Pagination.jsx     # Page controls with size selector
│   │   └── Toast.jsx          # Auto-dismissing success/error banner
│   └── users/
│       ├── FilterPopup.jsx    # Field-level filter popup
│       ├── UserFormModal.jsx  # Add/Edit form modal with validation
│       └── UserTable.jsx      # Data grid with sortable headers
├── context/
│   └── UserContext.jsx     # Global user state + CRUD via useReducer
├── hooks/
│   └── useUserTable.js     # Table-level search/sort/filter/paginate logic
├── pages/
│   └── Dashboard.jsx       # Main page; composes all components
├── test/
│   ├── setup.js
│   ├── validation.test.js  # 14 tests for form validation helpers
│   └── userHelpers.test.js # 16 tests for filter/sort/pagination helpers
└── utils/
    ├── userHelpers.js      # Pure functions: filter, sort, paginate
    └── validation.js       # Field validators for form inputs
```

## Setup & Run

**Prerequisites:** Node.js >= 18

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run unit tests (30 tests, 2 suites)
npm test

# Build for production
npm run build
```

## Assumptions

1. **JSONPlaceholder does not persist data.** All mutations are simulated optimistically in local state. On refresh, original 10 users are re-fetched.
2. **"Department" maps to `company.name`** in the JSONPlaceholder schema.
3. **New user IDs** use `Date.now()` to avoid collisions with the fixed `id: 11` from JSONPlaceholder.
4. **Website is optional** — validation only fires when a value is provided.

## Challenges & Improvements

**Challenges faced:**
- JSONPlaceholder returns only 10 users, so pagination is demonstrated on a small dataset.
- Mapping nested schema (e.g. `company.name`) to a flat form required careful translation in the context layer.

**Given more time:**
- Add React Query for proper caching, refetching, and optimistic mutations
- Implement server-side pagination/filtering
- Add component-level integration tests with Axios mocked
- Sync filter/sort/page state to the URL query string for shareable links
- Add virtualized rendering for large datasets
