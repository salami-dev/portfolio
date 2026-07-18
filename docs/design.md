# Portfolio Design System

## 1. Design Direction

### Name
**Editorial Depth**

### Positioning
A sophisticated, high-trust portfolio identity for a cross-disciplinary engineer and technical leader whose work spans interface engineering, backend systems, data, cloud infrastructure, architecture, and delivery.

The design must communicate:

- technical depth without visual clutter
- strategic thinking without becoming corporate
- seniority without feeling distant
- craftsmanship across both product and engineering
- clarity, structure, and deliberate decision-making

### Brand statement
> Clear thinking made visible.

### Supporting message
> I design systems, build products, and solve complex technical problems across interface, backend, data, and infrastructure.

### Brand keywords
- Insightful
- Structured
- Mature
- Credible
- Intentional
- Technical
- Editorial
- Calm
- Cross-disciplinary

---

## 2. Core Design Principles

### 2.1 Editorial, not ornamental
Layouts should feel more like a well-designed technical journal than a generic developer portfolio.

Use:
- strong typographic hierarchy
- long-form reading rhythm
- generous margins
- restrained dividers
- carefully paced sections
- prominent project narratives

Avoid:
- decorative gradients
- excessive animations
- skill progress bars
- logo clouds
- generic dashboard styling
- visual effects that compete with content

### 2.2 Technical depth should be visible
Architecture, interfaces, metrics, systems, diagrams, and decisions should be shown directly.

Use:
- architecture diagrams
- annotated interfaces
- system maps
- design rationale
- performance evidence
- trade-off notes
- project timelines
- before-and-after comparisons

### 2.3 Frontend is a first-class discipline
The portfolio should show interface design and frontend engineering as equal to backend, data, and infrastructure work.

Demonstrate:
- responsive UI
- accessibility
- stateful interaction
- visualization
- component architecture
- design systems
- loading and error states
- performance and rendering decisions

### 2.4 Cross-disciplinary work should be explicit
Projects should not be grouped into isolated skill silos.

Instead, identify each project by the disciplines it spans:

- Interface Engineering
- Product Design
- Backend Architecture
- Data Systems
- Cloud Infrastructure
- Platform Engineering
- Security
- Reliability
- Performance
- Domain Modelling

### 2.5 Restraint signals confidence
Use fewer elements, but make each element more meaningful.

The visual hierarchy should be obvious without requiring:
- exaggerated scale changes
- bright color everywhere
- heavy card nesting
- unnecessary shadows
- large amounts of iconography

---

## 3. Color System

### 3.1 Primary palette

| Token | Name | Hex | Usage |
|---|---|---:|---|
| `--color-charcoal` | Charcoal | `#1F2937` | Primary text, dark surfaces |
| `--color-stone` | Stone | `#6B7280` | Secondary text, metadata |
| `--color-ivory` | Ivory | `#FAF7F2` | Primary page background |
| `--color-forest` | Forest | `#0F766E` | Primary accent, links, active states |
| `--color-copper` | Copper | `#B45309` | Secondary accent, emphasis |

### 3.2 Extended neutrals

| Token | Hex | Usage |
|---|---:|---|
| `--color-ink` | `#111827` | Strong headings |
| `--color-paper` | `#FFFDFC` | Elevated surfaces |
| `--color-sand` | `#E7E1D9` | Borders and dividers |
| `--color-mist` | `#F2EEE8` | Section backgrounds |
| `--color-muted` | `#9CA3AF` | Low-emphasis labels |
| `--color-dark-surface` | `#18202B` | Technical dark panels |
| `--color-dark-border` | `#2E3947` | Borders on dark surfaces |

### 3.3 Functional colors

| Token | Hex | Usage |
|---|---:|---|
| `--color-success` | `#15803D` | Successful states |
| `--color-warning` | `#B45309` | Warning and attention |
| `--color-error` | `#B91C1C` | Error states |
| `--color-info` | `#0369A1` | Informational states |

### 3.4 Color usage rules

- Ivory should dominate the site.
- Charcoal should be used for most typography.
- Forest is the main interaction color.
- Copper should be used sparingly for emphasis, diagram nodes, and key project details.
- Avoid large areas of saturated color.
- Dark sections should be reserved for:
    - architecture diagrams
    - technical writing callouts
    - code and system views
    - portfolio closing sections
- Never place Forest and Copper together at equal visual weight.
- Copper should generally occupy less than 10% of any screen.

### 3.5 CSS tokens

```css
:root {
  --color-charcoal: #1F2937;
  --color-stone: #6B7280;
  --color-ivory: #FAF7F2;
  --color-forest: #0F766E;
  --color-copper: #B45309;

  --color-ink: #111827;
  --color-paper: #FFFDFC;
  --color-sand: #E7E1D9;
  --color-mist: #F2EEE8;
  --color-muted: #9CA3AF;
  --color-dark-surface: #18202B;
  --color-dark-border: #2E3947;

  --color-success: #15803D;
  --color-warning: #B45309;
  --color-error: #B91C1C;
  --color-info: #0369A1;
}
```

---

## 4. Typography

### 4.1 Typeface roles

#### Display and editorial headings
**DM Serif Display**

Use for:
- homepage hero
- project titles
- major section openings
- featured quotations
- case-study headlines

Do not use for:
- buttons
- labels
- navigation
- dense technical diagrams
- body text

#### Body and interface typography
**Source Sans 3**

Use for:
- body copy
- navigation
- UI labels
- project metadata
- captions
- buttons
- forms
- technical explanations

#### Code and technical labels
**JetBrains Mono**

Use for:
- code
- system labels
- diagram nodes
- metrics
- timestamps
- technical metadata
- project tags
- inline implementation details

### 4.2 Font stacks

```css
:root {
  --font-display: "DM Serif Display", Georgia, serif;
  --font-body: "Source Sans 3", Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "SFMono-Regular", Consolas, monospace;
}
```

### 4.3 Type scale

| Role | Size | Line height | Weight |
|---|---:|---:|---:|
| Display XL | `clamp(3.5rem, 7vw, 7rem)` | `0.95` | 400 |
| Display L | `clamp(2.75rem, 5vw, 5rem)` | `1.0` | 400 |
| Heading 1 | `clamp(2.25rem, 4vw, 3.75rem)` | `1.05` | 400 |
| Heading 2 | `clamp(1.75rem, 3vw, 2.75rem)` | `1.15` | 400 |
| Heading 3 | `1.5rem` | `1.25` | 600 |
| Body L | `1.25rem` | `1.6` | 400 |
| Body | `1rem` | `1.65` | 400 |
| Body S | `0.9rem` | `1.55` | 400 |
| Label | `0.75rem` | `1.2` | 600 |
| Mono S | `0.78rem` | `1.5` | 500 |

### 4.4 Typography rules

- Display headings should be short.
- Avoid centering long text blocks.
- Body text should rarely exceed 70 characters per line.
- Use uppercase labels only for:
    - project categories
    - section eyebrows
    - diagram annotations
    - metadata
- Uppercase labels should have `0.08em` to `0.14em` letter spacing.
- Do not use more than three type sizes within a single card.
- Use italics sparingly, mainly for editorial emphasis or supporting statements.
- Avoid bolding entire sentences.

### 4.5 Example hierarchy

```html
<p class="eyebrow">CROSS-DISCIPLINARY ENGINEER</p>
<h1>I design systems, build products, and solve complex problems.</h1>
<p class="lede">
  I work across interface engineering, backend architecture,
  data, infrastructure, and production systems.
</p>
```

---

## 5. Layout System

### 5.1 Grid

Use a 12-column desktop grid.

```css
.page-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
}
```

Breakpoints:

| Breakpoint | Width |
|---|---:|
| Mobile | `< 640px` |
| Tablet | `640px–1023px` |
| Desktop | `1024px–1439px` |
| Wide | `≥ 1440px` |

### 5.2 Content widths

| Content type | Max width |
|---|---:|
| Full page shell | `1440px` |
| Standard content | `1200px` |
| Case-study body | `760px` |
| Wide technical content | `1100px` |
| Reading column | `680px` |

### 5.3 Spacing scale

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;
  --space-10: 8rem;
}
```

### 5.4 Section rhythm

- Standard section padding:
    - desktop: `96px 0`
    - tablet: `72px 0`
    - mobile: `56px 0`
- Hero padding:
    - desktop: `128px 0 104px`
    - mobile: `88px 0 64px`
- Project transitions should use either:
    - a clear border
    - a large spacing break
    - a tonal background shift
- Do not stack multiple section separators at once.

---

## 6. Surface and Border Language

### 6.1 Border radius

Use restrained radii.

```css
:root {
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;
  --radius-pill: 999px;
}
```

Rules:
- Buttons: `4px–8px`
- Cards: `8px–14px`
- Technical diagrams: `4px–8px`
- Avoid heavily rounded, playful interfaces.

### 6.2 Borders

Primary divider:

```css
border: 1px solid var(--color-sand);
```

Technical dark divider:

```css
border: 1px solid var(--color-dark-border);
```

### 6.3 Shadows

Use shadows only to indicate:
- overlay
- floating preview
- layered system view
- active card

```css
--shadow-soft: 0 10px 30px rgba(17, 24, 39, 0.08);
--shadow-deep: 0 18px 50px rgba(17, 24, 39, 0.14);
```

Most standard cards should rely on borders rather than shadows.

---

## 7. Navigation

### Structure

Recommended primary navigation:

- Work
- Domains
- Notes
- About
- Contact

Optional:
- Lab
- Open Source

### Behaviour

- Sticky after the hero enters scroll.
- Transparent or Ivory at top.
- Adds a subtle bottom border when sticky.
- Active route uses Forest.
- Mobile menu should open as a full-width editorial sheet, not a small floating dropdown.

### Desktop treatment

- Name or wordmark left-aligned.
- Links right-aligned.
- Use Source Sans 3.
- Contact can be a restrained outlined button.
- Avoid animated underlines that feel playful.

---

## 8. Homepage Composition

### 8.1 Hero

Suggested structure:

- eyebrow
- display headline
- supporting statement
- primary CTA
- secondary CTA
- technical illustration or project composition

Example:

> I design systems, build products, and solve complex technical problems.

Supporting text:

> Cross-disciplinary engineer working across interface engineering, backend systems, data, cloud infrastructure, and production operations.

Primary CTA:
- View selected work

Secondary CTA:
- Read engineering notes

### 8.2 Hero visual

Use an abstract technical composition instead of a stock illustration.

Possible forms:
- layered systems diagram
- connected product surfaces
- UI panels linked to services and data
- annotated architecture
- interface and infrastructure shown as one connected system

The visual should show breadth without becoming a technology logo collage.

### 8.3 Featured work

Show three flagship projects.

Each project card should include:

- project name
- one-sentence problem statement
- disciplines involved
- visible project artifact
- complexity statement
- link to case study

Example discipline tags:

```text
Interface Engineering · Data Systems · Cloud Infrastructure
```

### 8.4 Domain map

Display the areas of operation as a connected system, not isolated skill boxes.

Recommended visual:

```text
Interfaces
    ↓
Product Systems
    ↓
Services and Workflows
    ↓
Data and Computation
    ↓
Cloud and Operations
```

Allow each layer to link to projects and technical notes.

### 8.5 Engineering notes

Use editorial cards with:
- title
- short abstract
- topic label
- reading time
- publication date

Avoid blog-card patterns with large stock thumbnails.

### 8.6 Closing section

Use a dark Charcoal surface.

Content:
- short statement
- contact CTA
- minimal system diagram
- social and GitHub links

---

## 9. Project Cards

### Required content

Each card must communicate:

1. What the system does
2. What disciplines it spans
3. What makes it technically difficult
4. What can be inspected

### Anatomy

```text
[Project category]
Project title
Short project statement
Discipline tags
Technical challenge
Preview image or diagram
View case study →
```

### Visual treatment

- Ivory or Paper background
- 1px Sand border
- Minimal shadow
- Large visual
- Editorial title
- Mono labels
- Forest interaction state
- Copper only for one notable detail

### Hover state

- subtle image translation: maximum `4px`
- border changes to Forest
- arrow shifts `2px–4px`
- no scaling above `1.01`

---

## 10. Case Study Template

Each case study should follow a consistent structure.

### 10.1 Header
- project category
- project title
- short statement
- disciplines
- year
- role
- status
- repository/demo links

### 10.2 System overview
- what the product does
- who it is for
- why it exists
- primary constraints

### 10.3 Interface
Show:
- major workflows
- responsive states
- error states
- loading states
- interaction logic
- accessibility decisions

### 10.4 Architecture
Show:
- system diagram
- data flow
- service boundaries
- runtime topology
- major dependencies

### 10.5 Engineering complexity
Show:
- concurrency
- scaling
- data model
- performance
- failure handling
- security
- operational constraints

### 10.6 Decisions and trade-offs
Each decision block should contain:

- decision
- alternatives
- rationale
- cost
- future implication

### 10.7 Evidence
Show:
- metrics
- tests
- benchmarks
- screenshots
- trace examples
- deployment output
- dashboards
- repository structure

### 10.8 Retrospective
End with:
- what worked
- what changed
- what would be simplified
- what would be done differently

---

## 11. Diagrams and Technical Visuals

### 11.1 Diagram style

Use:
- thin lines
- restrained node shapes
- flat fills
- Forest for primary flow
- Copper for risk, bottleneck, or decision points
- Mono labels
- minimal icons

Avoid:
- cloud-provider icon walls
- dense vendor diagrams
- heavy drop shadows
- gradients
- skeuomorphic servers

### 11.2 Diagram tokens

```css
:root {
  --diagram-line: #6B7280;
  --diagram-line-active: #0F766E;
  --diagram-line-warning: #B45309;
  --diagram-node: #FFFDFC;
  --diagram-node-dark: #18202B;
  --diagram-label: #1F2937;
}
```

### 11.3 Architecture diagram rules

- Maximum three visual hierarchy levels.
- Show only components necessary to explain the system.
- Use annotations for:
    - trust boundaries
    - asynchronous flows
    - persistence
    - external dependencies
    - failure paths
- Every diagram should answer one question.
- Split complex systems across multiple diagrams rather than producing one unreadable diagram.

---

## 12. Data Visualization

### Style
- editorial, restrained, analytical
- no 3D charts
- no saturated rainbow palette
- avoid default dashboard appearance

### Recommended chart colors
- Primary series: Forest
- Secondary series: Charcoal
- Comparison series: Stone
- Highlight: Copper
- Confidence or range: Sand or Mist

### Chart rules
- label important values directly
- minimize legends
- use gridlines sparingly
- annotate changes and anomalies
- show units clearly
- explain why the chart matters

---

## 13. Buttons and Links

### Primary button

```css
.button-primary {
  background: var(--color-forest);
  color: white;
  border: 1px solid var(--color-forest);
  border-radius: var(--radius-sm);
}
```

### Secondary button

```css
.button-secondary {
  background: transparent;
  color: var(--color-charcoal);
  border: 1px solid var(--color-sand);
}
```

### Text link

- Forest text
- subtle arrow
- no underline by default
- underline or bottom border on hover
- visible keyboard focus state

### Button rules

- Use sentence case.
- Prefer verb-led labels:
    - View case study
    - Explore the system
    - Read the analysis
    - Open repository
- Avoid vague labels:
    - Learn more
    - Click here
    - Discover

---

## 14. Forms

### Style
- clear labels above fields
- Ivory background
- Charcoal text
- Sand borders
- Forest focus state
- Source Sans 3
- error text in Error red
- no placeholder-only labels

### Contact form fields
- Name
- Email
- Message
- Optional subject

### Validation
- inline
- immediate after interaction
- no destructive motion
- preserve entered data after errors

---

## 15. Motion

### Motion principles
- calm
- functional
- brief
- spatially coherent
- never decorative for its own sake

### Durations

| Interaction | Duration |
|---|---:|
| Hover | `120–180ms` |
| Section reveal | `300–450ms` |
| Modal or sheet | `220–320ms` |
| Diagram sequence | `500–800ms` |

### Easing

```css
--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
```

### Allowed motion
- slight fade and rise
- line drawing for architecture
- card detail reveal
- image sequence playback
- subtle diagram flow

### Avoid
- parallax-heavy sections
- bouncing
- cursor effects
- rotating titles
- autoplay video with sound
- long page transitions

### Reduced motion
All motion must respect:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 16. Accessibility

Minimum standard:
- WCAG 2.2 AA
- keyboard navigation
- visible focus indicators
- semantic headings
- descriptive link text
- accessible diagrams
- alt text for every meaningful image
- skip navigation link
- sufficient touch target size
- no color-only communication

### Contrast
- Body text must meet at least 4.5:1.
- Large text must meet at least 3:1.
- Interactive states must remain visible in both light and dark sections.

### Focus style

```css
:focus-visible {
  outline: 3px solid rgba(15, 118, 110, 0.35);
  outline-offset: 3px;
}
```

### Diagrams
Provide:
- descriptive caption
- text summary
- optional expanded explanation
- accessible reading order where interactive

---

## 17. Responsive Behaviour

### Mobile priorities
- preserve hierarchy
- shorten headings
- stack diagrams vertically
- collapse metadata into structured rows
- keep case studies readable
- avoid horizontal scrolling except for intentional technical content
- provide expandable code and diagrams where needed

### Hero
- visual moves below text
- maximum 2 CTAs
- display heading reduces to 3–4 lines
- avoid oversized empty space

### Project cards
- one column
- large preview
- tags wrap naturally
- no hover-only information

### Technical diagrams
- scale to fit where possible
- allow full-screen view
- provide simplified mobile version for dense diagrams

---

## 18. Iconography

### Style
- outline icons
- 1.5px stroke
- square or geometric construction
- minimal detail
- consistent optical size

### Usage
Use icons only where they improve scanning:
- project discipline
- contact
- navigation utility
- diagram legend
- external links

Avoid icons:
- beside every heading
- as decoration
- to replace clear text labels

---

## 19. Imagery

### Preferred visual assets
- annotated product interfaces
- architecture diagrams
- system maps
- data visualizations
- implementation details
- code excerpts
- process diagrams
- development artifacts
- simulation outputs

### Avoid
- generic stock photography
- laptop mockups floating in space
- abstract AI imagery
- glowing server rooms
- random code backgrounds
- technology-logo wallpapers

### Screenshot treatment
- crop tightly
- annotate selectively
- use neutral device frames only where context matters
- maintain consistent corner radius
- avoid excessive perspective distortion

---

## 20. Brand Voice

### Tone
- precise
- direct
- thoughtful
- technically credible
- calm
- evidence-led

### Writing principles
- explain what was built
- explain why it was difficult
- explain what decisions mattered
- explain what changed because of the work
- avoid inflated claims
- avoid vague passion language
- avoid excessive jargon without context

### Preferred language
Use:
- designed
- built
- modelled
- measured
- validated
- simplified
- improved
- operated
- investigated
- scaled
- recovered
- compared

Avoid:
- guru
- ninja
- rockstar
- obsessed
- world-class
- cutting-edge
- revolutionary
- magic

---

## 21. Component Inventory

### Core components
- Site header
- Mobile navigation sheet
- Hero
- Section heading
- Project card
- Project discipline tags
- Case-study metadata
- Architecture diagram
- Decision block
- Metric card
- Technical note card
- Code block
- Data chart
- Image comparison
- Quote
- Callout
- Timeline
- Table
- Contact form
- Footer

### Optional components
- Interactive system map
- Project filter
- Diagram legend
- Full-screen media viewer
- Code diff
- Before/after slider
- Architecture layer switcher
- Performance benchmark table

---

## 22. Example Design Tokens

```css
:root {
  /* Colors */
  --color-charcoal: #1F2937;
  --color-stone: #6B7280;
  --color-ivory: #FAF7F2;
  --color-forest: #0F766E;
  --color-copper: #B45309;
  --color-paper: #FFFDFC;
  --color-sand: #E7E1D9;
  --color-mist: #F2EEE8;
  --color-dark-surface: #18202B;

  /* Typography */
  --font-display: "DM Serif Display", Georgia, serif;
  --font-body: "Source Sans 3", Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 14px;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --space-7: 3rem;
  --space-8: 4rem;
  --space-9: 6rem;
  --space-10: 8rem;

  /* Motion */
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);

  /* Shadows */
  --shadow-soft: 0 10px 30px rgba(17, 24, 39, 0.08);
  --shadow-deep: 0 18px 50px rgba(17, 24, 39, 0.14);
}
```

---

## 23. Do and Do Not

### Do
- make the portfolio project-led
- show frontend, backend, data, and infrastructure together
- explain decisions and constraints
- use diagrams to clarify complexity
- show evidence and measurements
- make technical content readable
- build strong mobile layouts
- use whitespace deliberately
- keep visual emphasis selective

### Do not
- turn the site into a CV
- use skill bars
- use large technology-logo sections
- force every project to use every discipline
- create fictional metrics
- imitate a SaaS dashboard
- overload pages with animations
- publish proprietary system details
- use design trends that obscure the work

---

## 24. Final Direction

The final experience should feel like:

- an engineering journal
- a technical case-study archive
- a product portfolio
- an architecture notebook
- a leadership signal

The visitor should leave with one clear conclusion:

> Bashir can move across frontend, backend, data, infrastructure, and production operations, and can connect those disciplines into coherent systems.