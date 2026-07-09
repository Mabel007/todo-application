# Application Theme

---

## Document Information

**Category:** Project Foundation

**Related Ticket:** TA-19 Configure Application Branding & Theme Foundation

**Epic:** Epic 1 Project Foundation

**Status:** Complete

---

## Overview

The Todo Application Theme serves as the central reference for the project's visual identity and design system.

It establishes the application's typography, color palette, reusable design tokens, branding assets, and styling standards to ensure consistency across every page, component, and future feature.

The design system follows a **mobile-first**, **accessibility-focused**, and **component-driven** approach using Tailwind CSS v4, ShadCN/UI, CSS Custom Properties, and reusable design tokens.

---

## Theme Architecture

The application theme is built on the following foundations:

```text
Application Theme
│
├── Typography
├── Color System
├── Design Tokens
├── Theme Variables
├── Icon Library
├── Brand Assets
├── Utility Classes
└── Responsive Design
```

---

## Design System Documents

| Foundation    | Description                                  | Reference        |
| ------------- | -------------------------------------------- | ---------------- |
| Typography    | Fonts, hierarchy, sizing and usage           | typography.md    |
| Color System  | Brand colors and semantic color tokens       | colors.md        |
| Design Tokens | CSS custom properties and reusable variables | design-tokens.md |
| Icons         | Icon library standards and usage             | icons.md         |

---

## Technology Stack

The design system is implemented using:

- React 19
- TypeScript
- Tailwind CSS v4
- ShadCN/UI
- CSS Custom Properties
- Lucide React
- Fontsource Variable Fonts

---

## Typography

The Todo Application uses a two-font system to create a clean and modern user interface.

### Heading Font

**Sora Variable**

Used for:

- Page titles
- Section headings
- Cards
- Dialog titles
- Navigation headings

CSS Variable

```css
--font-heading
```

---

### Body Font

**Inter Variable**

Used for:

- Body text
- Labels
- Forms
- Buttons
- Navigation
- Tables
- Descriptions

CSS Variable

```css
--font-body
```

Reference:

```text
typography.md
```

---

## Color System

The application's visual identity is built around two primary brand colors.

| Token     | Value   | Purpose                                    |
| --------- | ------- | ------------------------------------------ |
| Primary   | #0D235E | Primary actions, navigation, branding      |
| Secondary | #38D6B2 | Accent color, highlights, success emphasis |

Supporting interface colors provide consistency throughout the application.

Reference:

```text
colors.md
```

---

## Design Tokens

The design system uses CSS Custom Properties as reusable design tokens.

Core token groups include:

- Typography
- Colors
- Border radius
- Borders
- Inputs
- Focus rings
- Sidebar colors
- Chart colors

All tokens are centralized within:

```text
src/styles/tokens.css
```

Reference:

```text
design-tokens.md
```

---

## Theme Variables

The application exposes semantic theme variables through Tailwind CSS v4 using the `@theme inline` directive.

This allows components to use semantic utility classes instead of hardcoded values.

Examples include:

- bg-primary
- text-primary
- border-border
- bg-card
- text-muted-foreground
- ring-ring

This approach keeps the UI flexible and simplifies future theme updates.

---

## Icon Library

The project uses **Lucide React** as the standard icon library.

Reasons for selecting Lucide React:

- Excellent TypeScript support
- Fully compatible with ShadCN/UI
- Tree-shakeable
- Lightweight
- Accessible
- Consistent visual style
- Large icon collection

Reference:

```text
icons.md
```

---

## Brand Assets

All branding assets are centralized under the assets directory.

```text
src/
└── assets/
    ├── icons/
    │   ├── app-icon.svg
    │   └── app-icon-rounded.svg
    │
    └── logos/
        ├── logo.svg
        ├── logo-horizontal.svg
        └── logo-icon.svg

public/
└── favicon.svg
```

Asset usage standards:

| Asset                | Usage                        |
| -------------------- | ---------------------------- |
| favicon.svg          | Browser tab                  |
| app-icon.svg         | Application icon             |
| app-icon-rounded.svg | Rounded application icon     |
| logo-icon.svg        | Compact branding             |
| logo-horizontal.svg  | Navigation and documentation |
| logo.svg             | Master logo                  |

---

## Utility Classes

The project provides reusable utility classes for common layout patterns.

Current utilities include:

- flex-center
- flex-between
- page-padding
- section-padding

Additional utilities should be added only when they provide reusable value beyond existing Tailwind CSS utilities.

---

## Responsive Design

The Todo Application follows a **mobile-first** responsive strategy.

Tailwind CSS default breakpoints are used throughout the application.

| Prefix  | Device        |
| ------- | ------------- |
| Default | Mobile        |
| sm      | Small Devices |
| md      | Tablet        |
| lg      | Laptop        |
| xl      | Desktop       |
| 2xl     | Large Desktop |

All new components should be designed mobile-first before adding larger breakpoint enhancements.

---

## Theme Principles

The application theme follows these principles:

- Consistency
- Reusability
- Simplicity
- Accessibility
- Scalability
- Maintainability
- Mobile-first Development
- Semantic Design Tokens

---

## Development Guidelines

When creating new components:

- Use semantic color utilities instead of hardcoded colors.
- Use CSS variables rather than literal values.
- Use `--font-heading` for headings.
- Use `--font-body` for body content.
- Use Lucide React icons.
- Use SVG assets from the centralized asset library.
- Reuse existing utility classes before creating new ones.
- Follow the established spacing and border radius tokens.

---

## Future Improvements

The design system is intended to grow alongside the application.

Future enhancements include:

- Dark mode theme switching
- Additional semantic color tokens
- Elevation and shadow tokens
- Motion and animation tokens
- Spacing scale tokens
- Component-specific tokens
- Theme customization support
- Design token synchronization with Figma

---

## Related Documentation

```text
docs/
└── design-system/
    ├── application-theme.md
    ├── typography.md
    ├── colors.md
    ├── design-tokens.md
    └── icons.md
```

The Application Theme serves as the primary entry point for all design system documentation. Future updates to the project's visual identity should be reflected here before being implemented across the application.
