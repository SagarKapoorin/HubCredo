HubCredo
========

Full‑stack authentication demo built with a React + TypeScript frontend and a Node.js/Express + TypeScript backend.

Monorepo Structure
------------------

- `client/` – React + Vite frontend (Tailwind CSS, React Router, Axios)
- `server/` – Node.js/Express backend (TypeScript, MongoDB, Redis, Zod)

Quick Start
-----------

1. Install dependencies

   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

2. Configure environment

- Backend: copy `server/.env.example` to `server/.env` and fill in the values (MongoDB, Redis, JWT secret, n8n webhook, etc.). See `server/README.md` for details.
- Frontend: create a `.env` (or `.env.local`) in `client/` and set:

  ```bash
  VITE_API_BASE_URL=http://localhost:4000
  ```

  If omitted, the client defaults to `http://localhost:4000`.

3. Run the backend

   ```bash
   cd server
   npm run build
   npm start
   ```

   The API will listen on `http://localhost:<PORT>` (default `4000`).

4. Run the frontend

   ```bash
   cd client
   npm run dev
   ```

   The app will be available at `http://localhost:5173` by default.

Project Docs
------------

- Backend details: `server/README.md`
- Frontend details: `client/README.md`

Author
------

Made by **Sagar Kapoor**  
Email: `sagarbadal70@gmail.com`

