# Pulse — Backend

Express.js + TypeScript backend for the Pulse Email Marketing SaaS.
Completely separate from the `frontend/` (Next.js) app — they talk only
over HTTP, no shared code, no Next.js API routes.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Then visit http://localhost:5000/api/health — you should see:

```json
{
  "status": "ok",
  "message": "Pulse backend is healthy",
  "timestamp": "..."
}
```

## Scripts

- `npm run dev` — starts the dev server with hot-reload (`ts-node-dev`)
- `npm run build` — compiles TypeScript to `dist/` (production build)
- `npm start` — runs the compiled `dist/server.js` (production)

## API endpoints so far

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server liveness check |
| GET | `/api/contacts` | List all contacts |
| GET | `/api/contacts/:id` | Get one contact |
| POST | `/api/contacts` | Create a contact (`name`, `email` required; `phone`, `city` optional) |
| PUT | `/api/contacts/:id` | Update a contact |
| DELETE | `/api/contacts/:id` | Delete a contact |

Contacts are stored in-memory (`src/data/contacts.store.ts`) for now —
data resets on every server restart. This gets replaced with real
PostgreSQL + Prisma queries in a later step.

## Current structure

```
backend/
├── src/
│   ├── app.ts                        Express app: middleware + route mounting
│   ├── server.ts                     Entry point — imports app, calls listen()
│   ├── config/
│   │   └── env.ts                    Centralized environment variable access
│   ├── routes/
│   │   ├── health.routes.ts          /api/health
│   │   └── contacts.routes.ts        /api/contacts (CRUD)
│   ├── controllers/
│   │   └── contacts.controller.ts    Request handlers for contacts
│   ├── data/
│   │   └── contacts.store.ts         Temporary in-memory "database"
│   └── types/
│       └── contact.types.ts          Contact, CreateContactInput, UpdateContactInput
├── .env                              Local env vars (gitignored, not committed)
├── .env.example                      Template showing which env vars are needed
├── package.json
├── tsconfig.json
└── .gitignore
```

Next: PostgreSQL + Prisma to replace the in-memory store with a real database.
