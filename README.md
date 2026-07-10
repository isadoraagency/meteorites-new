# Meteorites Landing

An interactive, scroll-driven landing page about meteorites. Built with **Next.js (App Router)** and **TypeScript**, animated with **GSAP/ScrollTrigger** and **Framer Motion**, with smooth scrolling via **Lenis** and a 3D "Stardust" scene rendered with **Spline**. Content is being migrated to **Storyblok** as a headless CMS.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| Language | [TypeScript 6](https://www.typescriptlang.org/) |
| Scroll animation | [GSAP 3](https://gsap.com/) + ScrollTrigger, ScrollToPlugin, MotionPathPlugin, SplitText |
| UI transitions | [Framer Motion 12](https://motion.dev/) (`LazyMotion`, strict mode) |
| Smooth scrolling | [Lenis](https://lenis.darkroom.engineering/) (`@studio-freight/lenis`) |
| 3D | [Spline](https://spline.design/) (`@splinetool/react-spline`) — "Stardust" scene |
| CMS | [Storyblok](https://www.storyblok.com/) (`@storyblok/react`, EU region) — integration in progress |
| Styling | Sass (SCSS) |
| Sanitization | [DOMPurify](https://github.com/cure53/DOMPurify) for CMS rich text |
| Linting | ESLint 9 (flat config) + typescript-eslint + react-hooks |
| Hosting | [Vercel](https://vercel.com/) |

## Getting started

### Prerequisites

- **Node.js 20.9+** (the project is developed on Node 24) and **npm**
- A **Storyblok preview token** for the space (ask a teammate, or find it in Storyblok under **Settings → Access Tokens**)

### Step by step

1. **Clone the repository and install dependencies:**

   ```bash
   git clone <repo-url>
   cd meteorites-new
   npm install
   ```

2. **Create a `.env.local` file** in the project root (see [Environment variables](#environment-variables)):

   ```bash
   STORYBLOK_PREVIEW_TOKEN=xxx
   ```

3. **Start the dev server:**

   ```bash
   npm run dev
   ```

   The dev server runs over **HTTPS** (`next dev --experimental-https`) — this is required for the Storyblok Visual Editor to embed the site. On first run, Next.js generates self-signed certificates into `certificates/` (gitignored) and may ask for your password to install a local certificate authority.

4. **Open [https://localhost:3000](https://localhost:3000).** If the browser shows a certificate warning, accept the self-signed certificate once.

Without a valid `STORYBLOK_PREVIEW_TOKEN` the app still runs, but Storyblok-driven content (currently the `menu` story) falls back to empty content with a console warning.

## Environment variables

Environment files (`.env*`) are gitignored. Use `.env.local` for local development.

| Variable | Required | Where it's used |
|---|---|---|
| `STORYBLOK_PREVIEW_TOKEN` | Yes | Server-side only. Used by `lib/storyblok.ts` to fetch stories from the Storyblok CDN API, and passed to the Storyblok Bridge **only** for Visual Editor requests (detected via the `_storyblok` query param in `proxy.ts` → `x-storyblok-preview` header → `app/layout.tsx`). It never reaches regular visitors. |
| `VERCEL_ENV` | Auto (Vercel) | Set automatically by Vercel (`production` / `preview` / `development`). Decides whether the app fetches **draft** or **published** content: production reads published, everything else reads drafts. Locally, `NODE_ENV` is the fallback signal. |

> **Note:** `STORYBLOK_PUBLIC_TOKEN` and `STORYBLOK_SPACE_ID` may appear in existing `.env.local` files, but they are **not currently read by the code** — content fetching uses the preview token for both draft and published versions. They are kept for the ongoing Storyblok migration.

On Vercel, set `STORYBLOK_PREVIEW_TOKEN` for all environments in **Project → Settings → Environment Variables** (or via `vercel env add`).

## Scripts

- `npm run dev` — start the Next.js dev server (HTTPS, self-signed certs)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Deployment

The project deploys to **Vercel**. Per `vercel.json`, builds only run for the `main` and `dev` branches — pushes to any other branch are ignored by Vercel.

- **`main`** → production (serves **published** Storyblok content)
- **`dev`** → preview deployment (serves **draft** Storyblok content, since `VERCEL_ENV !== "production"`)

## Animation guidelines

Two animation libraries coexist in this project, each with a clear responsibility:

| Concern | Library |
|---|---|
| Scroll-driven animation (pinning, scrub, snapping, parallax), timelines, text decode effects | **GSAP** |
| React enter/exit transitions (modals, overlays, menu) via `AnimatePresence`, state-driven UI animation | **Framer Motion** |
| Simple hovers and one-off transitions | **CSS** |

Rules:

- **GSAP is only imported from `lib/gsap.ts`** — never from `"gsap"`, `"gsap/all"` or plugin subpaths. That module registers every plugin exactly once and exports `gsap`, `ScrollTrigger`, `ScrollToPlugin`, `MotionPathPlugin` and `SplitText`.
- **Framer Motion uses `LazyMotion` in strict mode** (see `components/App.tsx`). Always use the lightweight `m` component (`m.div`), never `motion.div` — strict mode throws in dev if the full component sneaks in. This keeps the Framer bundle at a fraction of its full size. Only `domAnimation` features are loaded; if you ever need drag or layout animations, switch the feature set to `domMax`.
- **UI components don't scroll the page with raw GSAP.** To jump/scroll to a section from UI code (menu items, close buttons), use `scrollToAnchor()` from `lib/scroll.ts`, which suspends ScrollTrigger snapping during the jump. Direct `gsap.to(window, { scrollTo })` calls are reserved for scroll-orchestration components (e.g. `Navigation`).
- A component may legitimately use both libraries **only** when it owns a scroll-driven animation *and* an enter/exit transition (e.g. `Stardust`). Mixing them for the same concern is not allowed.
- `prefers-reduced-motion` support is pending design definitions (tracked separately): the plan is `MotionConfig reducedMotion="user"` for Framer, a `"(prefers-reduced-motion: reduce)"` condition in `gsap.matchMedia()` blocks, and disabling Lenis.

## Content

Content is being migrated from static JSON to Storyblok:

- **Storyblok (EU region)** — the `menu` story is fetched server-side via `lib/storyblok.ts`, with an automatic fallback to empty content if the story isn't published or the API is unreachable.
- **Static JSON** — the remaining sections (`about`, `credits`, `meteorites`, `sources`, `types`) are still served from `public/data/*.json`.

Draft vs. published resolution: development and Vercel preview deployments read **draft** content; only real production (`VERCEL_ENV === "production"`) reads **published** content.

`lib/StoryblokProvider.tsx` initializes the Storyblok Bridge client-side so the Visual Editor can highlight blocks and push live updates. The bridge only loads inside the Visual Editor iframe (requests carrying the `_storyblok` query param) — regular visitors never download it.

## Setting up the Storyblok Visual Editor (preview)

This is mainly for content editors. The Visual Editor lets you see the live site next to the content form and preview changes before publishing.

### One-time setup (per space)

1. Make sure the site is running. For local editing a developer must have the dev server up (`npm run dev` → https://localhost:3000). The preview **must be served over HTTPS** — Storyblok won't embed an insecure page.
2. In Storyblok, go to **Settings → Visual Editor**.
3. Set the **default environment (preview URL)** to the URL of the running site, e.g.:
   - `https://localhost:3000/` for local development, or
   - the deployed preview/staging URL once one exists.
4. Click **Save**.

You can add more than one environment (e.g. "Local" and "Staging") and switch between them from the dropdown at the top of the Visual Editor.

### Editing content

1. Go to **Content** and open a story (currently only `menu` is wired up — see the [Content](#content) section).
2. The right side shows the live preview; the left side shows the content form (blocks/fields).
3. Click a block either in the form or directly on the preview — the Storyblok Bridge highlights it and scrolls the form to the matching field.
4. Edit the fields. Changes appear in the preview in real time, **without saving**.
5. When you're happy:
   - **Save** — stores a draft. The app in development mode fetches drafts, so devs and other editors can see it, but it's not live.
   - **Publish** — makes the content live (production reads the published version).

### Troubleshooting

- **Blank preview / "refused to connect"** — the site isn't running at the configured preview URL, or the URL uses `http://` instead of `https://`. Ask a developer to start the dev server or fix the URL in **Settings → Visual Editor**.
- **Certificate warning on localhost** — open `https://localhost:3000` directly in a browser tab first and accept the self-signed certificate, then reload the Visual Editor.
- **Changes don't highlight/update live** — the Storyblok Bridge isn't loading. Check with a developer that `STORYBLOK_PREVIEW_TOKEN` is set in the app's `.env.local` and that the preview URL includes the `_storyblok` query param (Storyblok adds it automatically inside the Visual Editor).
- **Story shows old content on the site** — you saved but didn't **Publish** (or vice versa: production only shows published content).

## Project structure

```
app/                # App Router entry (layout + page)
components/         # UI sections (Intro, About, Stardust, TimeCapsules, Sources, ...)
hooks/              # Custom hooks (text decode animation, GSAP timeline helpers)
lib/                # Storyblok client/provider, Lenis provider, GSAP setup, scroll helpers
public/data/        # Static JSON content (being migrated to Storyblok)
styles/             # Global SCSS (base, layout, components, utils, mixins)
types/              # Shared content types
proxy.ts            # Next.js proxy — flags Storyblok Visual Editor requests
certificates/       # Local HTTPS certs, generated on first `npm run dev` (gitignored)
```
