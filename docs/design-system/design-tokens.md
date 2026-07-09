# Design Tokens

---

## Document Information

**Category:** Project Foundation

**Related Ticket:** TA-19 Configure Application Branding & Theme Foundation

**Epic:** TA-1 project Foundation

**Status:** Complete

---

## Overview

Design Tokens are the foundational values that define the visual language of the Todo Application.

They provide a centralized source of truth for typography, colors, spacing, border radius, focus states, and other reusable styling values.

Instead of hardcoding values throughout the application, components consume semantic design tokens using CSS Custom Properties and Tailwind CSS theme variables.

This approach ensures consistency, scalability, maintainability, and easier future theming.

---

## Design Token Architecture

```text
Design Tokens
│
├── Typography
├── Colors
├── Border Radius
├── Borders
├── Inputs
├── Focus Ring
├── Sidebar
├── Charts
└── Dark Theme
```

---

## Token Location

All design tokens are defined in:

```text
src/styles/tokens.css
```

They are exposed to Tailwind CSS through:

```text
src/index.css
```

using the `@theme inline` directive.

---

## Typography Tokens

Typography is controlled through reusable CSS variables.

| Token            | Purpose   |
| ---------------- | --------- |
| `--font-heading` | Headings  |
| `--font-body`    | Body text |

Example:

```css
--font-heading: "Sora Variable", sans-serif;

--font-body: "Inter Variable", sans-serif;
```

---

## Color Tokens

Brand and semantic colors are defined as reusable tokens.

Examples include:

```css
--background
--foreground

--primary
--primary-hover
--primary-foreground

--secondary
--secondary-hover
--secondary-foreground

--accent
--accent-foreground

--muted
--muted-foreground

--border
--input
--ring

--success
--warning
--destructive
```

These tokens are consumed throughout the application using Tailwind utility classes.

---

## Border Radius Tokens

Border radius is standardized using a single base token.

```css
--radius
```

Additional radius sizes are automatically derived inside `src/index.css`.

| Token          | Description        |
| -------------- | ------------------ |
| `--radius-sm`  | Small radius       |
| `--radius-md`  | Medium radius      |
| `--radius-lg`  | Default radius     |
| `--radius-xl`  | Large radius       |
| `--radius-2xl` | Extra large radius |
| `--radius-3xl` | 3× large radius    |
| `--radius-4xl` | 4× large radius    |

This keeps corner rounding consistent across all UI components.

---

## Surface Tokens

Surface tokens define the appearance of application containers.

Examples include:

```css
--card
--card-foreground

--popover
--popover-foreground

--background
--foreground
```

These tokens ensure visual consistency across cards, dialogs, menus, and layouts.

---

## Interaction Tokens

Interactive components rely on semantic tokens rather than hardcoded values.

Examples include:

```css
--border

--input

--ring

--accent

--primary
```

These tokens are used by:

- Buttons
- Inputs
- Checkboxes
- Dialogs
- Dropdown menus
- Navigation
- Forms

---

## Sidebar Tokens

Dedicated tokens have been defined for future sidebar components.

```css
--sidebar

--sidebar-foreground

--sidebar-primary

--sidebar-primary-foreground

--sidebar-accent

--sidebar-accent-foreground

--sidebar-border

--sidebar-ring
```

These provide flexibility without affecting the main application theme.

---

## Chart Tokens

Future dashboard components will use predefined chart tokens.

```css
--chart-1

--chart-2

--chart-3

--chart-4

--chart-5
```

Keeping chart colors centralized ensures visual consistency across analytics and reporting features.

---

## Dark Theme Tokens

The design token system includes a dedicated dark theme.

Dark mode overrides token values while preserving their semantic names.

Example:

```css
:root {
  --background: #f8fafc;
}

.dark {
  --background: #020817;
}
```

Components continue using:

```css
bg-background

text-foreground
```

without requiring separate implementations.

---

## Tailwind Integration

Tokens are exposed through Tailwind CSS using the `@theme inline` directive.

Example:

```css
--color-primary: var(--primary);

--color-background: var(--background);

--font-sans: var(--font-body);
```

This enables semantic Tailwind utilities such as:

```text
bg-primary

text-primary

bg-card

text-muted-foreground

border-border

ring-ring
```

---

## Benefits

The design token system provides:

- Centralized styling
- Improved consistency
- Easier maintenance
- Better scalability
- Simplified theme customization
- Reduced duplication
- Improved developer experience

---

## Best Practices

✔ Define new visual values as tokens.

✔ Reuse existing semantic tokens whenever possible.

✔ Reference tokens through Tailwind utilities.

✔ Keep all tokens inside `tokens.css`.

✔ Update documentation whenever new tokens are introduced.

---

## Avoid

Do not:

- Hardcode colors inside components.
- Hardcode font families.
- Duplicate existing tokens.
- Create component-specific tokens without justification.
- Modify token values directly inside component styles.

---

## Future Improvements

Future enhancements to the token system may include:

- Spacing scale tokens
- Shadow tokens
- Animation tokens
- Transition tokens
- Opacity tokens
- Z-index tokens
- Motion tokens
- Multi-theme support

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

typography.md

colors.md

icons.md
```

The design token system serves as the foundation of the Todo Application's design system. All future styling decisions should build upon these tokens to maintain consistency, accessibility, and scalability across the application.
