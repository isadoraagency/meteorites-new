# Meteorites Landing

An interactive, scroll-driven landing page about meteorites. Built with **Next.js (App Router)** and **TypeScript**, animated with **GSAP/ScrollTrigger** and **Framer Motion**, with smooth scrolling via **Lenis** and a 3D "Stardust" scene rendered with **Spline**. Content is being migrated to **Storyblok** as a headless CMS.

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [GSAP](https://gsap.com/) + ScrollTrigger — scroll-driven animation
- [Framer Motion](https://motion.dev/) — UI transitions
- [Lenis](https://lenis.darkroom.engineering/) — smooth scrolling
- [Spline](https://spline.design/) — 3D "Stardust" scene
- [Storyblok](https://www.storyblok.com/) — headless CMS (integration in progress)
- Sass (SCSS) for styling

## Getting started

```bash
npm install
npm run dev
```

The dev server runs over **HTTPS** (`next dev --experimental-https`) using the local certificates in `certificates/` — this is required for the Storyblok Visual Editor. Open [https://localhost:3000](https://localhost:3000).

### Environment variables

Create a `.env` file in the project root:

```bash
STORYBLOK_PREVIEW_TOKEN=xxx        # server-side, draft content
STORYBLOK_PUBLIC_TOKEN=xxx         # published content (production)
STORYBLOK_SPACE_ID=xxx
# Exposed to the browser so the Visual Editor bridge can initialize
NEXT_PUBLIC_STORYBLOK_PREVIEW_TOKEN=xxx
```

## Scripts

- `npm run dev` — start the Next.js dev server (HTTPS)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Content

Content is being migrated from static JSON to Storyblok:

- **Storyblok (EU region)** — the `menu` story is fetched server-side via `lib/storyblok.ts`, with an automatic fallback to the local JSON if the story isn't published or the API is unreachable.
- **Static JSON** — the remaining sections (`about`, `credits`, `meteorites`, `sources`, `types`) are still served from `public/data/*.json`.

`lib/StoryblokProvider.tsx` initializes the Storyblok Bridge client-side so the Visual Editor can highlight blocks and push live updates.

## Project structure

```
app/                # App Router entry (layout + page)
components/         # UI sections (Intro, About, Stardust, TimeCapsules, Sources, ...)
hooks/              # Custom hooks (text decode animation, GSAP timeline helpers)
lib/                # Storyblok client/provider, Lenis provider
public/data/        # Static JSON content (being migrated to Storyblok)
styles/             # Global SCSS (base, layout, components, utils, mixins)
types/              # Shared content types
certificates/       # Local HTTPS certs for the dev server
```
