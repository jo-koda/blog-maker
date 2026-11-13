# Demo Blog Creator

A WordPress-style blog creator built with Next.js 16, Tiptap, Redux Toolkit, and a Prisma schema. This is the frontend-only first pass: data lives in memory and resets when the server restarts.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. You land on the post list.

- `/posts` — all posts, filter by status, search
- `/posts/new` — the editor
- `/categories`, `/tags` — manage taxonomy
- `/blog` — the public blog

## What works

- Rich text editing with Tiptap: headings (H2–H4), bold, italic, underline, strikethrough, inline code, links, lists, quotes, code blocks, dividers, images (alt text required), undo/redo
- Draft autosave three seconds after you stop typing, with a "Saved at" indicator; Ctrl/Cmd+S saves
- Publish now, schedule for later, switch back to draft, archive, delete
- Category (hierarchical) and tags (create as you type) per post
- Cover image, excerpt, SEO title/description, canonical URL, comments toggle
- Draft preview, public blog with category and tag archives, Open Graph metadata, and JSON-LD
- HTML is rendered and sanitized on the server; the client only sends Tiptap JSON

## Not yet

Database connection, login, media uploads, comments, search, RSS, and sitemap. See `CLAUDE.md` → "Connecting Prisma" for the next step.
