@AGENTS.md

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:validate  # Validate prisma/schema.prisma
npx prettier --write .
```

## Status

Frontend-only demo. There is no database connection yet: services read and write an in-memory store (`lib/mock/db.ts`) that is seeded on boot and resets on server restart. `auth()` returns a seeded admin. The Prisma schema is final and validated; connecting it is the next step (see below).

The structure follows `kodasys` / `tile-social-nextjs`. The product spec is the "Blog Module: Technical Documentation (Next.js)" PDF.

## Architecture

### Route Structure

- `app/(dashboard)/` — the blog admin, rendered inside the sidebar shell
  - `posts/` — post table with status filter and search
  - `posts/new`, `posts/[id]/edit` — the Tiptap editor (both render `posts/[id]/edit/_sections/editor-view.tsx`)
  - `posts/[id]/preview` — renders the last saved version of any post, including drafts
  - `categories/`, `tags/`
- `app/blog/` — public blog: listing, `[slug]`, `category/[slug]`, `tag/[slug]`
- `app/api/cron/publish` — flips due `SCHEDULED` posts to `PUBLISHED`; requires `Authorization: Bearer $CRON_SECRET`

Each dashboard page keeps its own pieces next to it:

- `_redux/` — `*-state.tsx`, `*-slice.tsx`, and `*-query.tsx` for pure helpers
- `_sections/` — page sections; `provider.tsx` takes the server-fetched data as props and dispatches it into the slice
- `_components/` — page-specific hooks and smaller components

`page.tsx` is a server component that fetches through server actions inside a `Suspense` boundary and hands the results to `Provider`. Page slices are combined in the root `store.tsx`; use the typed `useAppDispatch` / `useAppSelector` / `useAppStore` from `hooks/hooks.tsx`.

### Backend Communication

Client components never touch the data layer directly.

1. **Services** (`services/*-service.tsx`) — one per table. Each function mirrors the Prisma call it will become and returns Prisma-shaped records (camelCase, `Date` fields, relations included like `include`).
2. **API actions** (`actions/api-actions/*-action.tsx`) — `'use server'` functions that check `auth()` and permissions (`lib/blog/access.ts`), validate, call services, map records to models (`lib/blog/mappers.ts`), and return `Result<T>`.
3. **Submit actions** (`actions/submit-actions/*`) — FormData adapters for `useActionState` forms.
4. **Models** (`models/`) — camelCase types with ISO date strings, and `Result<T>`.

Never export an unauthenticated mutation as a server action — server actions are public endpoints. Session-less jobs (scheduled publishing) live in `lib/` and are called from a secret-protected route handler.

### Editor and content

- `lib/blog/extensions.ts` is the single Tiptap extension list (all free Tiptap v3 extensions: tables, tasks, text style, align, highlight, sub/sup, details, math, emoji, YouTube/Twitch/audio, lowlight code blocks, table of contents), shared by the client editor and the server renderer. Editor-only extensions (placeholder, character count, focus, selection, invisible characters, file handler, node range, drag handle, bubble/floating menus) are added in `content-editor.tsx`.
- The client only ever sends Tiptap JSON. `savePost` renders HTML on the server (`lib/blog/render.ts`) and sanitizes it with an allowlist (`lib/blog/sanitize.ts`) before storing. Public pages render the stored `contentHtml`.
- `render.ts` swaps a few node views for static output: headings get slug ids (matching `lib/blog/outline.ts`, which builds the public "On this page" list), code blocks are highlighted to `hljs-*` spans, emoji become text, and math becomes a placeholder that is replaced with KaTeX markup after sanitizing. A new extension that renders new tags, attributes, or styles must be added to the sanitizer allowlist, or it is stripped from published posts.
- Image uploads go through `uploadImage` (`media-action.tsx`) into a mock object store (`lib/mock/storage.ts`) served at `/media/[...key]`. Swap `putObject`/`getObject` for S3/R2 when connecting real storage. Server actions accept bodies up to 6 MB (`next.config.ts`).
- `lib/mock/showcase-post.ts` seeds "The editor, feature by feature", which uses every extension. Check it after changing the extension list or the sanitizer.
- Drafts autosave 3s after the last edit (`use-post-save.tsx`). Autosave only writes drafts; published and scheduled posts save on Update.
- Slugs follow the title until the post is published or the slug is edited by hand; collisions get `-2`, `-3`. Changing a published slug records a `SlugRedirect`, and `/blog/[old-slug]` redirects permanently.

### Connecting Prisma

1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. `npm run db:migrate` to create tables, then add the full-text search column from the spec (section 6) in a SQL migration.
3. Add `lib/db.ts` with a `PrismaClient` singleton from `generated/prisma`.
4. Rewrite each service in `services/` against `db.*`. Actions, models, and UI should not need to change.
5. Delete `lib/mock/`, and replace `auth.tsx` with a real session.

### UI

Tailwind v4 with tokens in `app/globals.css` (`@theme inline`). Shared primitives are in `components/ui/` (`button`, `input`, `field`, `skeleton`), plus `components/modal.tsx`, `status-badge.tsx`, `page-header.tsx`, and `components/blog/` for the public article and post list. Icons come from `lucide-react`. Toasts use `sonner`, styled as a dark pill via the `toast` class. Article bodies use `@tailwindcss/typography` (`prose`).

## Key Conventions

- **Path alias**: `@/` resolves to the project root
- **Formatting**: single quotes, no semicolons, sorted Tailwind classes (Prettier, `.prettierrc`)
- **File names**: kebab-case
- **No comments in UI files** (`app/`, `components/`, `hooks/`)
