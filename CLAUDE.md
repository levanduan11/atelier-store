# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

never read .env

## Next.js version warning

This project uses Next.js 16 with breaking changes from what you may know (see `AGENTS.md`). Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (`01-app/` for the App Router). `next.config.ts` enables `cacheComponents` and `partialPrefetching`, which affect how pages, caching and data fetching must be written.

## Commands

```bash
docker compose up -d      # start local Postgres 16 (db: atelier_store, postgres/postgres on :5432)
cp .env.example .env      # DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, NEXT_PUBLIC_BETTER_AUTH_URL
npm run dev               # dev server on :3000
npm run build             # production build
npm run lint              # eslint (flat config, eslint.config.mjs)

npm run db:generate       # generate SQL migration in ./drizzle from src/db/schema.ts
npm run db:migrate        # apply migrations
npm run db:push           # push schema directly (no migration file)
npm run db:studio         # Drizzle Studio
```

There is no test runner configured.

## Architecture

- **Stack:** Next.js App Router (`src/app`), React 19, Tailwind CSS 4 (wired through `@tailwindcss/turbopack` rules in `next.config.ts`, not PostCSS), Postgres via Drizzle ORM + `pg`, auth via Better Auth. Path alias `@/*` → `src/*`.
- **Auth flow spans several files:**
  - `src/db/schema.ts` holds the Better Auth tables (`user`, `session`, `account`, `verification`) as Drizzle definitions. If Better Auth config changes (plugins, extra fields), the schema must be updated to match, then run `db:generate`/`db:migrate`.
  - `src/db/index.ts` creates the shared `pg` Pool and `db` Drizzle client from `DATABASE_URL`.
  - `src/lib/auth.ts` is the server-side Better Auth instance (Drizzle adapter, `provider: "pg"`, email/password enabled) and exports the `Session` type.
  - `src/app/api/auth/[...all]/route.ts` mounts Better Auth's handler for GET/POST.
  - `src/lib/auth-client.ts` is the client-side helper (`signIn`, `signUp`, `signOut`, `useSession`) using `NEXT_PUBLIC_BETTER_AUTH_URL`.
- `drizzle.config.ts` loads `.env` via `dotenv` and reads the schema from `src/db/schema.ts`, outputting migrations to `drizzle/`.
- Comments in the schema are written in Vietnamese; match the existing language when editing nearby comments.
