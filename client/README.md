HubCredo Client
===============

React + TypeScript + Vite frontend for the HubCredo authentication flow. It provides signup and login screens, a protected dashboard, and communicates with the HubCredo backend using JWTs in HttpOnly cookies.

Stack
-----

- Framework: React 19
- Router: React Router
- Language: TypeScript
- Build tool: Vite
- Styling: Tailwind CSS v4
- Forms & validation: React Hook Form + Zod
- HTTP client: Axios (via `src/lib/apiClient.ts`)

Features
--------

- Signup and login pages with client-side validation
- Protected `/dashboard` route using an auth context and `ProtectedRoute`
- Authentication via the backend `/api/auth/signup` and `/api/auth/login` endpoints
- API base URL configured via `VITE_API_BASE_URL` (defaults to `http://localhost:4000`)

Getting Started
---------------

Prerequisites:

- Node.js LTS
- HubCredo backend running (see `../server/README.md`)

Install dependencies:

```bash
cd client
npm install
```

Environment
-----------

The API client reads `VITE_API_BASE_URL` from the environment. Create a `.env` (or `.env.local`) file in `client/`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

If this variable is not set, the client falls back to `http://localhost:4000`.

Running the App
---------------

Development:

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173` by default.

Production build and preview:

```bash
cd client
npm run build
npm run preview
```

This builds the app to `dist/` and serves it locally for inspection.

Auth Flow Overview
------------------

- **Signup**: `POST /api/auth/signup` with `{ name, email, password }`
- **Login**: `POST /api/auth/login` with `{ email, password }`

On success, the backend sets an HttpOnly `token` cookie. The client then treats the user as authenticated and allows access to the dashboard route.

Author
------

Made by **Sagar Kapoor**  
Email: `sagarbadal70@gmail.com`

