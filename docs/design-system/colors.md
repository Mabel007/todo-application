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

These colors represent the primary visual identity of the Todo Application.

| Token           | Value   | Usage                                 |
| --------------- | ------- | ------------------------------------- |
| Primary         | #0D235E | Branding, primary buttons, navigation |
| Primary Hover   | #16357F | Hover state for primary actions       |
| Secondary       | #38D6B2 | Accent elements, highlights           |
| Secondary Hover | #25C79F | Hover state for accent elements       |

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

| Token             | Value   | Usage                |
| ----------------- | ------- | -------------------- |
| Border            | #E2E8F0 | Borders and dividers |
| Input             | #E2E8F0 | Form inputs          |
| Ring              | #38D6B2 | Focus ring           |
| Muted             | #F1F5F9 | Muted backgrounds    |
| Muted Foreground  | #64748B | Secondary text       |
| Accent            | #38D6B2 | Accent surfaces      |
| Accent Foreground | #FFFFFF | Accent text          |

---

## Status Colors

Status colors communicate feedback and application state.

| Token       | Value   | Usage                          |
| ----------- | ------- | ------------------------------ |
| Success     | #22C55E | Successful actions             |
| Warning     | #F59E0B | Warnings                       |
| Destructive | #EF4444 | Errors and destructive actions |

---

## Sidebar Colors

Dedicated colors for future sidebar components.

| Token                      | Value   |
| -------------------------- | ------- |
| Sidebar                    | #FFFFFF |
| Sidebar Foreground         | #0F172A |
| Sidebar Primary            | #0D235E |
| Sidebar Primary Foreground | #FFFFFF |
| Sidebar Accent             | #38D6B2 |
| Sidebar Accent Foreground  | #FFFFFF |
| Sidebar Border             | #E2E8F0 |
| Sidebar Ring               | #38D6B2 |

---

## Chart Colors

Reserved for future dashboards and analytics.

| Token   | Value   |
| ------- | ------- |
| Chart 1 | #0D235E |
| Chart 2 | #38D6B2 |
| Chart 3 | #16357F |
| Chart 4 | #25C79F |
| Chart 5 | #94A3B8 |

---

## Dark Theme

The application includes a dark theme token set to support future theme switching.

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
