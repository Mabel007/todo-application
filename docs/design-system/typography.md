# Typography

---

## Document Information

**Category:** Project Foundation

**Related Ticket:** TA-19 Configure Application Branding & Theme Foundation

**Epic:** TA-1 Project Foundation

**Status:** Complete

---

## Overview

The Todo Application typography system establishes a consistent visual hierarchy that promotes readability, accessibility, and a modern user experience.

The project uses a dual-font strategy, separating headings from body content to improve information hierarchy while maintaining a clean and professional appearance.

Typography is implemented using **Fontsource Variable Fonts** and centralized CSS custom properties.

---

## Typography Architecture

```text
Typography
│
├── Heading Font
├── Body Font
├── CSS Variables
├── Font Hierarchy
├── Responsive Typography
└── Accessibility
```

---

## Font Stack

### Heading Font

**Sora Variable**

Purpose:

- Page titles
- Section headings
- Card headings
- Dialog titles
- Navigation titles
- Empty state headings

CSS Variable

```css
--font-heading
```

Fallback

```css
"Sora Variable", sans-serif
```

---

### Body Font

**Inter Variable**

Purpose:

- Paragraphs
- Forms
- Buttons
- Labels
- Navigation
- Tables
- Lists
- Descriptions
- Helper text

CSS Variable

```css
--font-body
```

Fallback

```css
"Inter Variable", sans-serif
```

---

## Font Imports

Fonts are installed using **Fontsource**.

```bash
npm install @fontsource-variable/inter @fontsource-variable/sora
```

Imported in:

```text
src/index.css
```

```css
@import "@fontsource-variable/inter";
@import "@fontsource-variable/sora";
```

This approach provides:

- No external Google Fonts requests
- Better performance
- Offline availability
- Version-controlled fonts
- Consistent rendering

---

## CSS Variables

Typography is centralized using CSS custom properties.

```css
--font-heading
--font-body
```

Defined in:

```text
src/styles/tokens.css
```

Used in:

```text
src/index.css
```

```css
html {
  font-family: var(--font-body);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-heading);
}
```

---

## Typography Hierarchy

| Element    | Font           |
| ---------- | -------------- |
| H1         | Sora Variable  |
| H2         | Sora Variable  |
| H3         | Sora Variable  |
| H4         | Sora Variable  |
| H5         | Sora Variable  |
| H6         | Sora Variable  |
| Paragraph  | Inter Variable |
| Button     | Inter Variable |
| Label      | Inter Variable |
| Input      | Inter Variable |
| Navigation | Inter Variable |
| Table      | Inter Variable |

---

## Font Weight Guidelines

### Sora

| Weight | Usage            |
| ------ | ---------------- |
| 600    | Section headings |
| 700    | Page headings    |
| 800    | Hero headings    |

---

### Inter

| Weight | Usage           |
| ------ | --------------- |
| 400    | Body text       |
| 500    | Labels          |
| 600    | Buttons         |
| 700    | Strong emphasis |

---

## Responsive Typography

Typography follows a mobile-first approach.

Example:

| Element | Mobile    | Desktop  |
| ------- | --------- | -------- |
| H1      | text-4xl  | text-6xl |
| H2      | text-3xl  | text-5xl |
| H3      | text-2xl  | text-4xl |
| Body    | text-base | text-lg  |
| Small   | text-sm   | text-sm  |

Example:

```tsx
<h1 className="text-4xl font-bold lg:text-6xl">Dashboard</h1>
```

---

## Accessibility

Typography should follow these accessibility guidelines:

- Maintain sufficient contrast.
- Avoid using font weight alone to convey meaning.
- Preserve readable line heights.
- Avoid excessively small text.
- Maintain responsive scaling.
- Prefer semantic HTML elements over styled `div` elements.

---

## Best Practices

- Use semantic heading elements (`h1`–`h6`).

- Use `--font-heading` for all headings.

- Use `--font-body` for all body content.

- Prefer Tailwind typography utilities over inline styles.

- Maintain a clear visual hierarchy.

- Keep paragraph widths readable.

---

## Avoid

Do not:

- Import additional fonts without approval.
- Hardcode font families.
- Use multiple heading fonts.
- Use decorative fonts.
- Override typography tokens inside components.

---

## Future Improvements

Future typography enhancements may include:

- Typography scale tokens
- Fluid typography
- Reduced motion typography animations
- International font fallbacks
- Print typography support

---

## Related Files

```text
src/
├── index.css
└── styles/
    └── tokens.css
```

---

## Related Documentation

```text
application-theme.md

colors.md

design-tokens.md
```

The typography system should remain centralized and any future font changes should be made through the typography tokens rather than individual components.
