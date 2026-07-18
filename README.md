# Personal Engineering Portfolio

A static editorial portfolio for cross-disciplinary engineering work across interface engineering, backend systems, data engineering, cloud infrastructure, reliability, performance, and architecture.

The site is intentionally structured as:

```text
Static editorial portfolio
+
Independent interactive engineering exhibits
```

Most pages render as static Astro HTML. React is reserved for small interactive islands, such as the mobile navigation toggle and future engineering demonstrations.

## Stack

- Astro with static output
- TypeScript strict mode
- React islands only where interaction requires client state
- Astro Content Collections
- MDX for projects and engineering notes
- Native CSS with design tokens and cascade layers
- CSS Modules for React islands
- React Flow and D3 installed for future technical exhibits
- Vitest
- Playwright
- axe-core accessibility checks

## Architecture

- `src/pages`: static public routes
- `src/layouts`: document, page, and MDX content shells
- `src/components/astro`: static components and technical visuals
- `src/components/react`: isolated interactive islands
- `src/content`: `projects`, `notes`, and `labs` collections
- `src/lib`: routing, metadata, status, and date invariants
- `src/styles`: token-driven global CSS layers

Future interactive demos should live under feature folders such as:

```text
src/components/react/demos/SystemTopology/
```

Each demo owns its components, state, styles, fixtures, types, and tests.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:4321`.

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run test
npm run test:e2e
npm run check
```

## Content Authoring

Content enters through Astro Content Collections in `src/content/config.ts`.

Do not place implementation styling choices in frontmatter. Use semantic fields such as `title`, `summary`, `thesis`, `disciplines`, `status`, and links.

## Adding A Project

Add an MDX file in `src/content/projects`.

Project content currently acts as a drafting boundary. Public project detail routes should only be reintroduced when an entry has working code, permitted real-world detail, or substantive technical analysis that can be inspected.

Required fields include:

- `title`
- `slug`
- `summary`
- `thesis`
- `disciplines`
- `status`
- `featured`
- `publishedAt`
- `complexity`
- `role`
- `year`

Do not publish invented metrics, outcomes, repository links, demos, users, customers, revenue, or scale.

Projects may also define media:

```yaml
mainImage:
  src: /images/example.jpg
  alt: Short description of the image
  caption: Optional visible caption
supportingImages:
  - src: /images/example-detail.jpg
    alt: Short description of the supporting image
    caption: Optional visible caption
```

If no project images are available, the public page renders the technical visual frame from `cover` instead.

## Adding A Note

Add an MDX file in `src/content/notes`.

Notes should remain out of public navigation until there are at least three substantive articles.

Notes support the controlled MDX authoring components:

- `Callout`
- `Figure`

## Adding A Lab Experiment

Add a JSON file in `src/content/labs`.

Each lab should have one narrow technical question, a short explanation, disciplines, status, and a visual frame. Publish lab routes only after at least two demonstrations are working or otherwise meaningfully inspectable.

## Deployment

The project builds static output suitable for Cloudflare Pages.

Use:

```bash
npm run build
```

Cloudflare Pages should publish the `dist` directory. The configured production domain is `https://salami.tech`.

## Testing

Run:

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Playwright tests cover navigation, mobile menu behavior, work-page publishing criteria, keyboard navigation, reduced-motion handling, accessibility, and responsive smoke checks.

## Accessibility Expectations

Changes must preserve semantic landmarks, visible focus states, keyboard navigation, sufficient contrast, minimum touch targets, reduced-motion support, and meaningful text alternatives for technical diagrams.

Automated axe checks are included, but manual review is still required for content quality, focus order, diagram comprehension, and responsive reading rhythm.
