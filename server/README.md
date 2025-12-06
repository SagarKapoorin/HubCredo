HubCredo Server
===============

Node.js/Express backend written in TypeScript using MongoDB (Mongoose) and Redis, following a controller–service architecture with schema validation and n8n webhook integration.

Stack
-----

- Runtime: Node.js
- Framework: Express
- Language: TypeScript
- Database: MongoDB (via Mongoose)
- Cache: Redis
- Validation: Zod
- Auth:
  - Password hashing: bcryptjs
  - JWT-based auth with HttpOnly cookies
- Automation: n8n webhook on signup and login

Project Structure
-----------------

- `src/index.ts` – App bootstrap, MongoDB and Redis connection, Express setup
- `src/models/User.ts` – Mongoose user model
- `src/services/authService.ts` – Auth business logic (signup, login, Redis caching, n8n calls)
- `src/controllers/authController.ts` – HTTP controllers for auth routes
- `src/routes/authRoutes.ts` – Auth routes (`/api/auth/signup`, `/api/auth/login`)
- `src/validation/authSchemas.ts` – Zod schemas for request validation
- `src/middleware/validateRequest.ts` – Request body validation middleware
- `src/middleware/errorHandler.ts` – Centralized error handling
- `src/lib/redisClient.ts` – Redis client instance

Getting Started
---------------

Prerequisites:

- Node.js LTS
- MongoDB instance (local or hosted)
- Redis instance (local or hosted)
- Optional: n8n workspace with a webhook configured

Install dependencies:

```bash
cd server
npm install
```

Environment Variables
---------------------

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

Required variables:

- `PORT` – Port for the Express server (e.g. `4000`)
- `MONGODB_URI` – MongoDB connection string
- `JWT_SECRET` – Secret key for signing JWTs
- `N8N_WEBHOOK_URL` – n8n production webhook URL for auth events
- `NODE_ENV` – `development` or `production`
- `REDIS_URL` – Redis connection URL

Running the Server
------------------

Build and run:

```bash
cd server
npm run build
npm start
```

The server listens on `http://localhost:PORT` (default `4000`).

API Overview
------------

Base URL: `http://localhost:PORT/api/auth`

### POST `/signup`

Request body:

```json
{
  "name": "Test User",
  "email": "user@example.com",
  "password": "password123"
}
```

Responses:

- `201 Created` with JSON:
  - `{ "id": string, "email": string, "name": string }`
- Sets an HttpOnly `token` cookie with a JWT.

Validations and errors:

- `400` – Invalid body (Zod validation) or email already in use
- `500` – Server error

Side effects:

- User persisted in MongoDB
- User cached in Redis
- Asynchronous POST to `N8N_WEBHOOK_URL` with:
  - `email`, `name`, `date`, `message` (`Hi <name> ! thanks for signing up. We are excited to see you onboard`)

### POST `/login`

Request body:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Responses:

- `200 OK` with JSON:
  - `{ "id": string, "email": string, "name": string }`
- Sets an HttpOnly `token` cookie with a JWT.

Validations and errors:

- `400` – Invalid body (Zod validation)
- `401` – Invalid credentials
- `500` – Server error

Side effects:

- User fetched from Redis cache when available, otherwise from MongoDB and cached
- Asynchronous POST to `N8N_WEBHOOK_URL` with:
  - `email`, `name`, `date`, `message` (`Hi <name> ! thanks for logging in. We are excited to see you again`)

Validation
----------

Requests pass through Zod-based validation before reaching controllers:

- `signupSchema` and `loginSchema` in `src/validation/authSchemas.ts`
- `validateRequest` middleware parses and validates `req.body`
- On failure, returns `400` with a structured error payload

Auth and Security
-----------------

- Passwords are hashed with `bcryptjs` and never stored in plain text.
- JWTs contain minimal data (subject only) and are signed with `JWT_SECRET`.
- Tokens are issued with an expiration (`7d`).
- Tokens are delivered to clients as HttpOnly cookies to reduce XSS exposure.
- In production (`NODE_ENV=production`), cookies are marked `secure`.

Error Handling
--------------

- All controllers delegate errors to `errorHandler` middleware.
- Known application errors carry a `statusCode` and are mapped to:
  - `400` – Validation and bad input cases
  - `401` – Authentication failures
  - `500` – Unhandled server errors
- Responses for `500` do not leak internal error details.

Redis Usage
-----------

- `src/lib/redisClient.ts` creates a single Redis client.
- On app startup, Redis is connected before MongoDB.
- `authService` uses Redis to:
  - Cache user data by email on signup and login
  - Read from cache first on login to reduce MongoDB reads
- Cache entries are set with TTL to avoid stale data.

n8n Integration
---------------

- The service reads `N8N_WEBHOOK_URL` from the environment.
- On successful signup and login, it posts a JSON payload with user info and a human-readable message.
- Calls are wrapped in `try/catch` and executed in a fire-and-forget async function so webhook failures never break auth.

Extending the API
-----------------

Best practices when adding new features:

- Follow the controller–service pattern:
  - Keep HTTP concerns in controllers.
  - Keep business logic in services.
- Add validation schemas in `src/validation` and apply them with `validateRequest`.
- Centralize new reusable utilities under `src/lib`.
- Prefer async/await and handle errors via the global `errorHandler`.
- For protected routes:
  - Implement a JWT verification middleware that reads the `token` cookie.
  - Attach the user or userId to `req` and pass it down to controllers/services.

Author
------

Made by **Sagar Kapoor**  
Email: `sagarbadal70@gmail.com`

