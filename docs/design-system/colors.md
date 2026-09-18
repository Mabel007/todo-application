# Color System

---

## Document Information

**Category:** Project Foundation

**Related Ticket:** TA-19 Configure Application Branding & Theme Foundation

**Epic:** TA-1 Project Foundation

**Status:** Complete

---

## Overview

The Todo Application color system defines the visual identity of the application through a centralized set of semantic color tokens.

Rather than using hardcoded colors throughout the application, all components consume CSS custom properties defined in the design token system. This approach improves consistency, maintainability, accessibility, and future theme customization.

The color palette is inspired by the application's branding, combining a professional navy blue with a vibrant teal accent to create a clean and modern productivity experience.

---

## Color Architecture

```text
Color System
│
├── Brand Colors
├── Semantic Colors
├── Surface Colors
├── Status Colors
├── Sidebar Colors
├── Chart Colors
└── Dark Theme
```

---

## Brand Colors

These colors represent the primary visual identity of the Todo Application. TA-205 supersedes
the earlier application UI navy #0D235E with the approved canonical navy #0F2458. Legacy logo
artwork is temporarily exempt and is not application color authority.

| Token          | Value   | Usage                                 |
| -------------- | ------- | ------------------------------------- |
| Primary        | #0F2458 | Branding, primary actions, navigation |
| Primary Hover  | #183A78 | Hover reference for primary actions   |
| Primary Active | #0A193D | Active reference for primary actions  |
| Brand Teal     | #38D6B2 | Restrained brand highlights           |
| UI Teal        | #0F766E | Focus and accessible teal interaction |

---

## Surface Colors

Surface colors define the application's layout and content areas.

| Token              | Value   | Usage                  |
| ------------------ | ------- | ---------------------- |
| Background         | #F8FAFC | Application background |
| Foreground         | #0F172A | Primary text           |
| Card               | #FFFFFF | Cards                  |
| Card Foreground    | #0F172A | Card text              |
| Popover            | #FFFFFF | Popovers and dropdowns |
| Popover Foreground | #0F172A | Popover text           |

---

## UI Colors

Reusable interface colors.

| Token             | Value   | Usage                 |
| ----------------- | ------- | --------------------- |
| Border            | #E2E8F0 | Borders and dividers  |
| Border Strong     | #64748B | Meaningful boundaries |
| Input             | #FFFFFF | Form input surface    |
| Ring              | #0F766E | Focus ring            |
| Muted             | #F1F5F9 | Muted backgrounds     |
| Muted Foreground  | #475569 | Secondary text        |
| Accent            | #CCFBF1 | Accent surfaces       |
| Accent Foreground | #115E59 | Accent text           |

Current shared semantic action/navigation references:

| Token                       | Value                       | Usage                              |
| --------------------------- | --------------------------- | ---------------------------------- |
| Secondary                   | #F1F5F9                     | Neutral secondary surface          |
| Secondary Foreground        | #0F2458                     | Secondary content                  |
| Link / Hover / Active       | #0F2458 / #183A78 / #0A193D | Destination states                 |
| Navigation Foreground       | #475569                     | Default application navigation     |
| Navigation Active Indicator | #0F766E                     | Non-color-supported route marker   |
| Ring Offset                 | #FFFFFF                     | Deterministic light-surface offset |

---

## Status Colors

Status colors communicate feedback and application state.

| Token       | Value             | Usage                        |
| ----------- | ----------------- | ---------------------------- |
| Success     | #166534 / #F0FDF4 | Success foreground / surface |
| Warning     | #854D0E / #FFFBEB | Warning foreground / surface |
| Destructive | #B91C1C / #FEF2F2 | Error foreground / surface   |

---

## Sidebar Colors

Dedicated colors for future sidebar components.

| Token                      | Value   |
| -------------------------- | ------- |
| Sidebar                    | #FFFFFF |
| Sidebar Foreground         | #0F172A |
| Sidebar Primary            | #0F2458 |
| Sidebar Primary Foreground | #FFFFFF |
| Sidebar Accent             | #CCFBF1 |
| Sidebar Accent Foreground  | #115E59 |
| Sidebar Border             | #E2E8F0 |
| Sidebar Ring               | #0F766E |

---

## Chart Colors

Reserved for future dashboards and analytics.

| Token   | Value   |
| ------- | ------- |
| Chart 1 | #0F2458 |
| Chart 2 | #0F766E |
| Chart 3 | #183A78 |
| Chart 4 | #38D6B2 |
| Chart 5 | #94A3B8 |

---

## Dark Theme

The repository retains a pre-TA-205 dark token block as future-facing groundwork. Runtime theme
switching is not implemented or supported by TA-205. Its values are not a final approved dark
theme contract and must be reconciled by a separately scoped future Jira ticket.

Dark mode:

- Inverts surface colors.
- Maintains brand consistency.
- Preserves accessibility.
- Uses the same semantic token names.

No component should define separate dark colors directly. Components should always consume semantic tokens.

---

## CSS Variables

Color tokens are defined in:

```text
src/styles/tokens.css
```

They are exposed to Tailwind CSS through:

```text
src/index.css
```

using the `@theme inline` directive.

---

## Tailwind Usage

Components should consume semantic utility classes instead of hardcoded values.

Examples:

```tsx
<Button className="bg-primary text-primary-foreground">Save</Button>
```

```tsx
<Card className="bg-card border-border">
```

```tsx
<p className="text-muted-foreground">
```

---

## Accessibility

The color system follows these principles:

- Maintain sufficient contrast between foreground and background.
- Never communicate information using color alone.
- Use semantic tokens instead of literal colors.
- Ensure interactive states remain visually distinct.
- Preserve readability in both light and dark themes.

---

## Best Practices

- Use semantic color utilities.

- Use CSS variables instead of hex values.

- Keep all color definitions inside `tokens.css`.

- Reuse existing semantic tokens before introducing new ones.

- Keep branding colors consistent across the application.

---

## Avoid

Do not:

- Hardcode hex values inside components.
- Create duplicate semantic colors.
- Override theme colors locally.
- Use inline styles for colors.
- Add new colors without updating the design system documentation.

---

## Future Improvements

Future enhancements include:

- Expanded semantic color palette
- Theme customization
- Multiple brand themes
- High contrast accessibility theme
- Color token synchronization with Figma

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

design-tokens.md

icons.md
```

The color system serves as the single source of truth for all visual styling throughout the Todo Application. Future UI components should consume semantic color tokens rather than introducing new color values.
