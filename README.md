# Print Hub

A responsive shared 3D-printer management system for Abdullah, Basel, Saleh, and Rocks.

## Included

- English and Arabic interface with instant RTL/LTR switching
- Password login, PostgreSQL sessions, password changes, and one active Admin
- Queue-only print start flow with pause, resume, live countdown, finish, fail, and cancel
- Filament inventory, ownership, low-stock alerts, and usage logs
- Favorites, print history, search, filters, user/global statistics
- Maintenance records with multi-user payment validation
- Persistent in-app notifications with read/unread state
- Dark/light mode, responsive desktop and mobile layouts
- JSON export/import and Admin reset controls

## Requirements

- Node.js 18 or newer
- PostgreSQL 14 or newer

## Setup

1. Create a PostgreSQL database named `print_hub`.
2. Copy `.env.example` to `.env` and update `DATABASE_URL` and `SESSION_SECRET`.
3. From the `Final` folder, install packages:

   ```bash
   npm install
   ```

4. Create the tables and sample data:

   **PowerShell:**

   ```powershell
   psql "$env:DATABASE_URL" -f database/schema.sql
   psql "$env:DATABASE_URL" -f database/seed.sql
   ```

   **Command Prompt:**

   ```bat
   psql "%DATABASE_URL%" -f database/schema.sql
   psql "%DATABASE_URL%" -f database/seed.sql
   ```

   You can also paste both SQL files into pgAdmin Query Tool, running `schema.sql` first.

5. Start the app:

   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Default accounts

| Username | Password | Initial role |
|---|---|---|
| Abdullah | `1234` | Admin |
| Basel | `1234` | Member |
| Saleh | `1234` | Member |
| Rocks | `1234` | Member |

Change each password from Account Settings after the first login.

## Project structure

```text
Final/
├── database/
│   ├── schema.sql
│   └── seed.sql
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .env.example
├── db.js
├── package.json
└── server.js
```

All application records are stored in PostgreSQL. The browser only keeps the display theme and a small language fallback.
