# Agent Instructions

This repository uses **Astro + TypeScript + React islands + MDX Content Collections + token-driven CSS + Cloudflare Pages**.

These instructions define how automated agents should reason about, modify, and extend the codebase. The goal is not merely to produce working code. Changes must preserve clear ownership, explicit domain boundaries, predictable runtime behaviour, and long-term maintainability.

## 1. Sources of truth

Before making UI, branding, typography, spacing, colour, layout, motion, or component-styling decisions, read:

- [`docs/design.md`](docs/design.md)

`docs/design.md` is the source of truth for visual language and design intent.

This file is the source of truth for engineering structure and implementation behaviour.

When the two documents appear to conflict:

1. Preserve the design intent from `docs/design.md`.
2. Preserve the architectural constraints in this file.
3. Resolve the implementation at the lowest-complexity layer that satisfies both.
4. Do not invent a third design system, local token scheme, or parallel component vocabulary.

## 2. Core engineering principles

### 2.1 Prefer explicit code over clever code

Write code that reveals its purpose, ownership, and failure modes.

Prefer:

- descriptive names;
- small, cohesive modules;
- explicit transformations;
- typed return values at public boundaries;
- readable control flow;
- direct data dependencies;
- intentional comments for non-obvious decisions.

Avoid:

- compressed abstractions that conceal behaviour;
- deeply generic helpers;
- unnecessary metaprogramming;
- implicit global state;
- anonymous data shapes crossing module boundaries;
- wrappers that merely forward arguments without enforcing a rule.

### 2.2 Model real boundaries

Create boundaries where ownership, lifecycle, runtime, or failure behaviour differs.

Valid boundaries in this stack include:

- build-time content versus request-time data;
- Astro-rendered markup versus hydrated React behaviour;
- content schema versus presentation model;
- design tokens versus component styles;
- Cloudflare runtime code versus framework-agnostic application code;
- external API payloads versus internal canonical types.

Do not split code into layers merely to imitate an enterprise pattern.

### 2.3 Normalise external data early

External APIs, MDX frontmatter, environment variables, and Cloudflare platform objects must not leak unchecked through the application.

Convert them at the boundary into canonical internal representations.

Use this flow:

```text
external input
    -> validation
    -> normalisation
    -> canonical internal type
    -> rendering or business logic
```

### 2.4 Centralise invariants

A rule should have one authoritative implementation.

Examples:

- one content schema per collection;
- one canonical URL builder;
- one date-formatting policy;
- one source of design tokens;
- one metadata generation path;
- one image handling strategy;
- one analytics event definition per event;
- one environment-variable parser;
- one rule for deciding whether a component hydrates.

Do not duplicate business or presentation rules across Astro pages, React components, MDX files, and utility modules.

### 2.5 Design for failure and recovery

For any network, runtime, content, or deployment dependency, consider:

- what fails;
- how the failure is surfaced;
- whether retry is safe;
- whether fallback is appropriate;
- whether stale content is preferable to no content;
- whether the failure occurs at build time or request time;
- whether the failure can break deployment.

Do not silently swallow failures.

## 3. Architectural shape

The default architecture is **Astro-first, content-driven, progressively enhanced, and edge-conscious**.

Astro owns:

- routing;
- page composition;
- static rendering;
- server rendering where required;
- content collection access;
- metadata;
- page-level data loading;
- non-interactive components;
- layout and semantic document structure.

React owns only interactive islands that require client-side state, event handling, or browser APIs.

MDX owns authored content, not application logic.

CSS tokens own visual decisions. Components consume tokens; they do not create private design systems.

Cloudflare Pages owns deployment and edge execution. Platform-specific code must remain isolated.

## 4. Recommended repository structure

Use the existing structure when present. For new modules, prefer the following shape:

```text
src/
  components/
    astro/
    react/
    shared/
  content/
    config.ts
    <collection>/
  layouts/
  pages/
  lib/
    content/
    metadata/
    routing/
    validation/
    analytics/
    cloudflare/
  styles/
    tokens.css
    reset.css
    base.css
    utilities.css
  types/
  assets/
public/
docs/
  design.md
```

### Placement rules

- Put Astro-only components in `src/components/astro`.
- Put hydrated or potentially hydrated React components in `src/components/react`.
- Put framework-neutral view models, validators, and helpers in `src/lib`.
- Put globally shared public types in `src/types` only when they are used across meaningful boundaries.
- Keep page-specific helpers close to the page until reuse is proven.
- Do not create a `utils` dumping ground.
- Do not create generic `services` or `repositories` folders unless the codebase contains real service or persistence boundaries.

## 5. Astro rules

### 5.1 Astro is the default rendering layer

Use `.astro` components unless browser-side interactivity is required.

Do not use React for:

- static layout;
- headings;
- cards with no state;
- article rendering;
- navigation markup that can work without JavaScript;
- metadata;
- build-time content transforms;
- simple conditional rendering;
- visual-only wrappers.

### 5.2 Keep page frontmatter orchestration-focused

Astro page frontmatter may:

- load content;
- validate route parameters;
- build canonical view models;
- choose layouts;
- prepare metadata;
- return redirects or errors.

It should not become a large unstructured application layer.

Extract logic when:

- it is reused;
- it has independent validation rules;
- it transforms external data;
- it deserves unit tests;
- it obscures the page's rendering intent.

### 5.3 Make build-time and request-time behaviour explicit

Agents must identify whether a page is:

- fully static;
- statically generated from content;
- server-rendered;
- dependent on runtime bindings;
- dependent on request headers, cookies, or geolocation.

Do not introduce server rendering for a feature that can be built statically.

Do not assume Node.js runtime APIs are available on Cloudflare.

## 6. React island rules

### 6.1 Hydration must be justified

Every hydrated React component must have a clear reason to exist.

Valid reasons include:

- local interactive state;
- complex input handling;
- browser-only APIs;
- client-side filtering or search;
- interactive visualisation;
- optimistic UI;
- a third-party React dependency that cannot reasonably be replaced.

Invalid reasons include:

- team familiarity with React;
- convenience for static markup;
- avoiding Astro syntax;
- using a React package for functionality available in the platform.

### 6.2 Choose the narrowest hydration directive

Use the least expensive directive that satisfies the interaction.

General preference:

1. no hydration;
2. `client:visible` for below-the-fold interactive sections;
3. `client:idle` for non-critical enhancements;
4. `client:media` for conditional UI;
5. `client:load` only when immediate interaction is required;
6. `client:only` only when server rendering is impossible or unsafe.

Document unusual hydration choices in code.

### 6.3 Keep islands small and independent

An island should own one coherent interaction.

Avoid:

- page-sized React roots;
- global client stores for local state;
- hydrating entire sections because one child is interactive;
- React context spanning unrelated islands;
- client-side fetching when Astro can provide the initial data.

Pass serialisable, canonical props from Astro into React.

### 6.4 Preserve progressive enhancement

Where practical, the non-JavaScript experience should remain usable.

Prefer:

- real links over click handlers;
- real forms over JavaScript-only submissions;
- semantic controls;
- server- or build-rendered initial content;
- enhancement rather than replacement.

## 7. TypeScript rules

### 7.1 Treat boundaries as typed contracts

Use explicit types for:

- component public props;
- content-derived view models;
- environment configuration;
- analytics events;
- external API adapters;
- Cloudflare bindings;
- public helper return values.

Local implementation details may rely on inference when the type is obvious.

### 7.2 Avoid unsafe escape hatches

Do not use `any` unless interacting with an unavoidable untyped boundary, and contain it immediately.

Prefer:

- `unknown` plus validation;
- discriminated unions;
- narrow literal types;
- exhaustive switches;
- explicit null handling;
- schema-derived types where appropriate.

Do not use type assertions to bypass an unresolved data problem.

### 7.3 Model state explicitly

For UI and content state, prefer discriminated unions over loose booleans.

Example:

```ts
type LoadState<T> =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'empty' }
    | { status: 'error'; message: string };
```

Avoid ambiguous combinations such as `isLoading`, `hasError`, `isEmpty`, and nullable `data` existing independently.

### 7.4 Separate transport types from application types

External payload types must not become internal domain types by default.

Use adapters:

```text
API response -> validated transport type -> internal type -> view model
```

The same rule applies to content frontmatter and Cloudflare bindings.

## 8. MDX and Content Collections

### 8.1 Content Collections are the canonical content boundary

All structured authored content should enter through Astro Content Collections unless there is a documented reason otherwise.

Define schemas in `src/content/config.ts` or the repository's equivalent content configuration.

Schemas must:

- validate required fields;
- provide safe defaults only where defaults are semantically valid;
- constrain enums and identifiers;
- validate dates and URLs;
- reject malformed content at build time;
- describe relationships explicitly.

### 8.2 Keep frontmatter semantic

Frontmatter should describe content, not component implementation.

Prefer:

```yaml
title: Example title
summary: Example summary
publishedAt: 2026-07-18
tags:
  - architecture
```

Avoid:

```yaml
cardVariant: blueLargeRounded
marginTop: 48px
useTwoColumnHero: true
```

Presentation choices belong in layouts, components, or semantic variants defined by the design system.

### 8.3 Treat MDX components as a controlled API

The MDX component map is a public authoring interface.

It must be:

- deliberate;
- documented;
- stable;
- semantically named;
- accessible by default;
- backed by design tokens.

Do not expose low-level layout primitives merely because they exist.

Prefer authoring components such as:

- `Callout`;
- `Figure`;
- `CodeExample`;
- `Comparison`;
- `Metric`;
- `Steps`.

Avoid generic components such as `Box`, `Flex`, or `Div` in content unless the design system explicitly defines them as authoring primitives.

### 8.4 Derive view models before rendering

Content entries should be normalised before reaching complex page templates.

Examples:

- formatted dates;
- resolved related content;
- canonical URLs;
- reading-time estimates;
- grouped navigation;
- image metadata;
- publication state.

Keep repeated content transformations out of page markup.

### 8.5 Preserve deterministic builds

Content builds must not depend on unstable, non-versioned, or unauthenticated remote data unless explicitly required.

When remote content is necessary:

- validate it;
- define failure behaviour;
- consider caching;
- avoid making deploy success depend on a fragile endpoint;
- document whether stale data is acceptable.

## 9. Token-driven CSS

### 9.1 Read the design specification first

Before changing CSS, read [`docs/design.md`](docs/design.md).

Do not infer a new visual system from isolated screenshots or individual components when the design specification already defines the intended system.

### 9.2 Tokens are the visual source of truth

Use semantic CSS custom properties for:

- colour;
- typography;
- spacing;
- radii;
- shadows;
- borders;
- container widths;
- z-index layers;
- motion duration;
- easing;
- breakpoints where represented in CSS.

Prefer semantic names:

```css
--color-surface-default
--color-text-muted
--space-section-block
--radius-control
--shadow-elevated
```

Avoid component-specific tokens unless the component represents a stable design-system concept.

### 9.3 Do not bypass tokens casually

Hard-coded values are acceptable only when they are:

- mathematically derived;
- required by an external asset;
- specific to a one-off technical constraint;
- documented because tokenisation would reduce clarity.

Do not introduce arbitrary colour, spacing, radius, or typography values inside components.

### 9.4 Keep CSS ownership clear

Use:

- global styles for reset, base elements, tokens, and genuinely global utilities;
- component-local styles for component composition;
- semantic variants for supported design alternatives;
- media queries only where the layout behaviour actually changes.

Avoid:

- global selectors targeting component internals;
- deeply nested selectors;
- specificity escalation;
- `!important` except for documented integration constraints;
- utility proliferation that recreates an ungoverned second design system.

### 9.5 Prefer resilient layout primitives

Use modern CSS layout intentionally:

- Grid for two-dimensional layout;
- Flexbox for one-dimensional distribution;
- logical properties;
- intrinsic sizing;
- `min()`, `max()`, and `clamp()` where they improve responsiveness;
- container queries when component context matters more than viewport width.

Avoid JavaScript-driven layout when CSS can express the behaviour.

## 10. Components and design-system behaviour

### 10.1 Components should encode stable concepts

Create a shared component when at least one is true:

- it expresses a reusable design-system concept;
- it centralises accessibility behaviour;
- it centralises a business or content invariant;
- it appears repeatedly with the same semantics;
- inconsistent implementations would create meaningful risk.

Do not extract a component solely to reduce line count.

### 10.2 Distinguish composition from configuration

Prefer composable slots and semantic props.

Prefer:

```tsx
<Card tone="subtle" emphasis="featured" />
```

over:

```tsx
<Card
    background="#f5f5f5"
    borderRadius={18}
    padding={32}
    showTopBorder
/>
```

### 10.3 Preserve semantic HTML

Choose elements based on document meaning, not default appearance.

Maintain:

- heading hierarchy;
- landmark structure;
- link and button distinction;
- list semantics;
- form labels;
- table semantics;
- appropriate disclosure patterns.

## 11. Data loading and integrations

### 11.1 Keep network access at explicit boundaries

Do not fetch data inside arbitrary presentational components.

Preferred ownership:

- Astro page or endpoint for request-scoped data;
- build pipeline for content-derived data;
- isolated adapter for external APIs;
- React island only for genuinely client-driven updates.

### 11.2 Validate configuration once

Environment variables and Cloudflare bindings must be parsed through one configuration boundary.

Do not read raw environment variables throughout the codebase.

The configuration module should:

- validate required values;
- distinguish build-time from runtime configuration;
- return typed values;
- avoid exposing secrets to client bundles;
- fail with actionable messages.

### 11.3 Make caching intentional

Any cache must define:

- cache owner;
- cache key;
- freshness period;
- invalidation strategy;
- stale behaviour;
- privacy implications.

Do not add caching merely because the deployment runs at the edge.

## 12. Cloudflare Pages

### 12.1 Assume an edge runtime, not Node.js

Do not rely on Node.js-only APIs, packages, filesystem access, or process behaviour unless the repository explicitly provides a compatible build-time path.

Review third-party dependencies for edge compatibility before adding them.

### 12.2 Isolate platform-specific code

Cloudflare-specific logic belongs in a clear adapter or platform module, such as:

```text
src/lib/cloudflare/
```

Do not spread Cloudflare request context, bindings, or platform objects through page components and domain logic.

### 12.3 Preserve static output where possible

Prefer static generation for content and marketing pages.

Use server rendering only for features that require request-time state, personalised data, protected content, or runtime bindings.

### 12.4 Treat deployment configuration as code

Changes to redirects, headers, functions, bindings, compatibility settings, or build commands must be:

- committed;
- reviewable;
- documented when non-obvious;
- consistent across environments;
- safe to reproduce.

Do not rely on undocumented dashboard-only changes.

### 12.5 Define failure behaviour for edge dependencies

For KV, D1, R2, Durable Objects, external APIs, or other runtime services, define:

- timeout behaviour;
- user-facing fallback;
- logging;
- retry safety;
- cache interaction;
- behaviour during partial outages.

## 13. Accessibility

Accessibility is an implementation requirement, not a review-stage enhancement.

Every change must preserve:

- keyboard access;
- visible focus states;
- sufficient contrast according to the design specification;
- semantic structure;
- reduced-motion preferences;
- form labels and error associations;
- meaningful alternative text;
- correct interactive roles and states.

Do not use ARIA to repair incorrect HTML when semantic HTML can express the behaviour.

## 14. Performance

Performance decisions must be evidence-driven.

Default priorities:

1. minimise hydrated JavaScript;
2. avoid unnecessary client-side fetching;
3. optimise image delivery;
4. preserve static rendering;
5. prevent layout shift;
6. limit third-party scripts;
7. keep content queries deterministic;
8. avoid expensive repeated transforms;
9. load non-critical functionality lazily.

Do not add memoisation, code splitting, caching, or client state management without a concrete need.

For performance-sensitive changes, identify the expected effect on:

- JavaScript payload;
- hydration cost;
- build time;
- edge execution time;
- content query cost;
- image weight;
- Core Web Vitals;
- third-party dependency cost.

## 15. Metadata, routing, and URLs

Centralise:

- canonical URL construction;
- title templates;
- description fallbacks;
- Open Graph metadata;
- structured data;
- sitemap inclusion rules;
- RSS or feed generation;
- trailing-slash policy;
- content slug generation.

Do not construct public URLs ad hoc in individual pages or components.

Route changes must consider:

- redirects;
- canonical URLs;
- inbound links;
- content references;
- sitemap and feed output;
- analytics continuity.

## 16. Analytics and client telemetry

Analytics events are contracts.

Each event must define:

- event name;
- trigger;
- required properties;
- optional properties;
- privacy implications;
- whether duplicate emission is safe.

Do not emit analytics directly from many components using inconsistent payloads.

Use a central typed analytics boundary.

Avoid collecting data that is not tied to a defined product or operational question.

## 17. Testing and verification

Test according to risk, not file count.

Prioritise tests for:

- content schema validation;
- external data adapters;
- canonical transformations;
- URL and metadata generation;
- interactive React behaviour;
- accessibility-critical components;
- route parameter handling;
- environment parsing;
- failure and empty states.

For visual changes:

- verify against `docs/design.md`;
- test responsive states;
- test keyboard navigation;
- test reduced motion;
- check both content-heavy and content-light cases;
- confirm long text does not break layout.

For content changes:

- run collection validation;
- check generated routes;
- verify internal links;
- inspect metadata output.

For deployment-affecting changes:

- verify the Cloudflare-compatible build;
- check environment assumptions;
- confirm no secret reaches the browser bundle;
- verify redirects and headers where relevant.

## 18. Dependency policy

Before adding a dependency, determine:

- why the platform or existing code cannot solve the problem;
- whether it runs at build time, server runtime, or client runtime;
- its impact on client JavaScript;
- its Cloudflare compatibility;
- its maintenance health;
- whether it duplicates an existing dependency;
- whether the abstraction cost is justified.

Prefer platform APIs and small local modules for narrow problems.

Do not add a large client library to solve a static rendering concern.

## 19. Change discipline

Agents must keep changes scoped and intentional.

For every non-trivial change:

1. identify the owning layer;
2. inspect existing patterns;
3. read `docs/design.md` for visual work;
4. preserve static rendering by default;
5. define or reuse canonical types;
6. avoid duplicating invariants;
7. consider failure and empty states;
8. verify accessibility;
9. verify Cloudflare compatibility;
10. document unusual trade-offs.

Do not mix unrelated refactors into a feature change.

Do not rename, relocate, or reformat large areas of the repository unless the task requires it.

Do not replace an existing pattern solely because another pattern is more fashionable.

## 20. Git branching, commits, and pull requests

Git history is part of the architecture. It must explain how the system changed, preserve review context, and make regressions easy to isolate or revert.

### 20.1 Protect the primary branch

Treat `main` as protected and deployable.

- Do not commit directly to `main`.
- Do not merge code that fails required checks.
- Do not use `main` as a working branch.
- Keep `main` releasable after every merge.
- Require pull-request review for non-trivial changes.
- Require the branch to be current with `main` before merge when repository protection rules support it.

If the repository uses a different protected default branch, apply these rules to that branch instead.

### 20.2 Use short-lived branches

Create one branch for one coherent change. Branches should normally live for hours or days, not weeks.

Use this naming format:

```text
<type>/<short-kebab-case-description>
```

Allowed branch types:

- `feat/` for user-visible capabilities;
- `fix/` for defects;
- `refactor/` for behaviour-preserving structural changes;
- `perf/` for measured performance work;
- `content/` for MDX or editorial changes;
- `design/` for design-system or visual implementation work sourced from `docs/design.md`;
- `test/` for test-only changes;
- `docs/` for documentation;
- `build/` for build tooling or dependencies;
- `ci/` for continuous-integration changes;
- `chore/` for maintenance that fits no more specific category;
- `hotfix/` for urgent production corrections.

Examples:

```text
feat/article-search
fix/mobile-nav-focus
content/add-edge-rendering-guide
design/refine-article-spacing
perf/defer-search-island
ci/cloudflare-preview-check
```

Do not use personal names, ticket-only names, vague labels, or permanent environment branches such as:

```text
bashir-work
updates
final-fix
new-version
staging-copy
```

Include an issue identifier only when it adds traceability:

```text
feat/WEB-142-article-search
```

### 20.3 Start from the latest protected branch

Before starting work:

```bash
git switch main
git pull --ff-only
git switch -c feat/example-change
```

Before requesting final review, incorporate the latest `main` using the repository's established strategy.

Prefer rebasing a private feature branch:

```bash
git fetch origin
git rebase origin/main
```

Do not rebase or force-push a shared branch without coordinating with its collaborators.

Resolve conflicts by preserving current architectural and design-system intent. Do not accept conflict sides mechanically.

### 20.4 Make semantic commits

Use Conventional Commit syntax:

```text
<type>(<optional-scope>): <imperative summary>
```

Common commit types:

- `feat`;
- `fix`;
- `refactor`;
- `perf`;
- `content`;
- `test`;
- `docs`;
- `style` for formatting-only changes;
- `build`;
- `ci`;
- `chore`;
- `revert`.

Use scopes that identify stable ownership boundaries, not arbitrary folders.

Suitable scopes include:

- `content`;
- `mdx`;
- `routing`;
- `metadata`;
- `search`;
- `design-tokens`;
- `navigation`;
- `analytics`;
- `cloudflare`;
- `build`.

Examples:

```text
feat(search): add client-side article filtering
fix(navigation): restore focus after closing mobile menu
refactor(content): centralise publication-state normalisation
perf(images): defer below-the-fold gallery loading
content(guides): add Cloudflare deployment article
design(design-tokens): add semantic code-block surface token
ci(cloudflare): validate preview deployment builds
```

Commit summaries must:

- use the imperative mood;
- state the observable change;
- remain concise;
- avoid trailing punctuation;
- avoid vague language such as `update`, `changes`, `cleanup`, `fix stuff`, or `WIP`.

Use the commit body when the reason, migration path, failure behaviour, or trade-off is not obvious.

For breaking changes, use `!` and explain the impact:

```text
feat(content)!: require canonical summaries for articles
```

Or include a `BREAKING CHANGE:` footer.

### 20.5 Commit incrementally

A commit should represent one logical, reviewable step.

Good incremental commits often follow this order:

1. introduce or change the schema, canonical type, or invariant;
2. implement the behaviour;
3. add or update tests;
4. update content, documentation, or deployment configuration.

This order is guidance, not a requirement. Each commit should be understandable on its own and should leave the repository in a valid state whenever practical.

Each commit must:

- have one primary purpose;
- include directly related tests or documentation;
- avoid unrelated formatting or renaming;
- avoid mixing a refactor with a behavioural change unless separation would be artificial;
- include generated output only with the source change that produced it;
- pass the checks relevant to its scope whenever practical.

Do not create one enormous commit for a multi-part feature merely to keep history short.

Do not create artificial micro-commits such as one commit per typo, import, or line when those changes form one logical step.

Use `fixup!` commits during local iteration when helpful, then autosquash them before final review:

```bash
git commit --fixup <target-commit>
git rebase -i --autosquash origin/main
```

Preserve meaningful incremental commits. Squash only noise, corrections, and abandoned intermediate approaches.

### 20.6 Keep commits buildable and revertable

Prefer commits that can be tested, cherry-picked, and reverted independently.

When a change cannot be safely activated in one step:

- introduce backward-compatible foundations first;
- add new behaviour behind an explicit boundary;
- migrate callers or content incrementally;
- remove the old path only after the new path is established.

Do not knowingly commit secrets, credentials, local environment files, generated caches, editor state, or Cloudflare dashboard exports containing sensitive values.

### 20.7 Open focused pull requests

A pull request should answer one architectural or product question.

Prefer multiple ordered pull requests when a change contains independently reviewable foundations, migrations, and feature behaviour.

A pull request must not combine unrelated work merely because it was developed at the same time.

Use a semantic PR title compatible with the commit convention:

```text
feat(search): add article filtering
```

For non-trivial work, the PR description should include:

```markdown
## Why
The problem, constraint, or user need.

## What changed
The concrete implementation and affected boundaries.

## Architecture
Why this layer owns the behaviour, including Astro/React, content, CSS-token, or Cloudflare decisions.

## Verification
Commands run, automated checks, manual test cases, and relevant environments.

## Design
How the implementation follows `docs/design.md`, or why this section is not applicable.

## Risks and rollback
Known risks, migrations, compatibility concerns, and how to revert or disable the change.
```

Add screenshots or recordings for visual and interactive changes. Include relevant viewport sizes and interaction states rather than only the ideal desktop state.

For content-heavy changes, include representative generated routes or preview links.

For Cloudflare-affecting changes, state whether the change affects:

- build configuration;
- runtime bindings;
- redirects or headers;
- compatibility settings;
- cache behaviour;
- preview and production parity.

### 20.8 Use draft PRs for early architectural feedback

Open a draft PR when:

- the change spans several incremental commits;
- a boundary or migration approach needs review;
- preview deployment feedback is useful before completion;
- another change depends on the branch.

A draft PR is not permission to leave the branch unexplained or continuously broken. Keep the description current as the implementation evolves.

Mark the PR ready only when:

- the intended scope is complete;
- temporary debugging code is removed;
- commits are understandable;
- relevant checks pass;
- the PR description reflects the final implementation;
- visual evidence is attached where required.

### 20.9 Review the diff as a system change

Before requesting review, inspect the complete branch diff against `main`:

```bash
git diff --stat origin/main...HEAD
git diff origin/main...HEAD
```

Check specifically for:

- accidental client hydration;
- unvalidated content or external data;
- duplicated tokens or hard-coded design values;
- Node.js-only code entering the Cloudflare runtime;
- secrets or environment values reaching client bundles;
- unrelated generated files;
- route, metadata, sitemap, or redirect regressions;
- accessibility regressions;
- temporary logs, comments, feature flags, or dead code.

Do not rely on reviewing only the final commit.

### 20.10 Respond to review with traceable changes

Address review feedback in additional semantic commits while review is active. This lets reviewers inspect exactly what changed.

Use fixup commits for small corrections when the repository expects a cleaned history before merge.

When responding to a review comment:

- state what changed;
- link the relevant commit or code location when useful;
- explain when no change was made and why;
- resolve the thread only after the concern is addressed or explicitly agreed.

Do not dismiss review feedback with an unexplained code change.

Avoid rewriting reviewed history unless required by repository policy. If a force-push is necessary, use:

```bash
git push --force-with-lease
```

Never use an unconditional `--force`.

### 20.11 Required checks before merge

Run the repository-defined commands. At minimum, verify the applicable equivalents of:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Do not invent missing scripts merely to satisfy this list. Use the package manager and scripts already established by the repository.

For this stack, the final build must exercise Astro's production build with the configured Cloudflare adapter where applicable.

Visual or interaction changes additionally require manual verification for:

- keyboard operation;
- focus visibility and order;
- responsive layouts;
- reduced motion;
- JavaScript-disabled baseline behaviour where progressive enhancement applies;
- loading, empty, error, and long-content states.

### 20.12 Merge strategy

Prefer **rebase and merge** when the platform supports it. This preserves meaningful semantic commits without adding merge bubbles.

Use **squash and merge** when:

- the branch contains noisy history that cannot be safely cleaned;
- the repository explicitly requires one commit per PR;
- the PR is a trivial single-purpose change where internal commit boundaries add no value.

When squashing, the final commit message must use the semantic PR title and retain important context from the PR description.

Use a **merge commit** only when:

- repository policy requires it;
- preserving the exact topology of a coordinated multi-branch integration is valuable;
- merging a long-lived release branch under an established release process.

Do not choose merge strategy based on convenience alone.

### 20.13 After merge

After a PR merges:

- delete the feature branch;
- update local `main` with `git pull --ff-only`;
- verify the deployment or preview result when the change affects runtime behaviour;
- create a follow-up issue or PR for deferred work instead of silently expanding the merged scope;
- revert through a dedicated `revert` or `hotfix` branch if production behaviour is incorrect.

Do not repair production by making undocumented Cloudflare dashboard changes unless an emergency requires it. Any emergency dashboard change must be captured in code immediately afterward.

### 20.14 Hotfix workflow

For an urgent production defect:

1. branch from the current production commit or protected `main`;
2. use `hotfix/<short-description>`;
3. make the smallest safe correction;
4. add a regression test where practical;
5. open an expedited PR;
6. run all checks relevant to the failure path;
7. merge using the normal protected process;
8. verify production;
9. follow with a separate root-cause or cleanup PR if broader remediation is required.

Urgency does not justify bypassing source control, validation, or review when those controls are available.

## 21. Code review checklist

Before presenting a change, confirm:

- Does Astro still own everything that does not require client interactivity?
- Is every React island justified and narrowly hydrated?
- Are external inputs validated and normalised?
- Are content schemas authoritative?
- Are design decisions sourced from `docs/design.md`?
- Does styling use existing semantic tokens?
- Is there one source of truth for each new invariant?
- Are loading, empty, error, and unavailable states explicit?
- Is the implementation accessible without relying on post-hoc ARIA fixes?
- Is the change compatible with Cloudflare Pages and the edge runtime?
- Has unnecessary client JavaScript been avoided?
- Are URLs, metadata, and analytics generated through central boundaries?
- Can the behaviour be understood without tracing through unnecessary abstractions?
- Are non-obvious trade-offs documented?

## 22. Preferred decision rule

When several implementations are valid, choose the one that:

1. keeps the page static;
2. uses semantic HTML;
3. requires the least client JavaScript;
4. preserves a clear ownership boundary;
5. centralises the invariant;
6. produces deterministic output;
7. fails visibly and recoverably;
8. remains understandable to the next engineer.

The target is not the smallest possible codebase. The target is a system whose behaviour remains clear as content, interaction, and deployment complexity grow.