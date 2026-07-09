# Icons

---

## Document Information

**Category:** Project Foundation

**Related Ticket:** TA-19 Configure Application Branding & Theme Foundation

**Epic:** TA-1 Project Foundation

**Status:** Complete

---

## Overview

The Todo Application uses **Lucide React** as its standard icon library and a centralized set of custom SVG brand assets.

Icons provide visual cues, improve usability, and reinforce the application's branding while maintaining consistency throughout the user interface.

All icons should be scalable, accessible, and reusable.

---

## Icon Architecture

```text
Icons
│
├── Lucide React
├── Application Icons
├── Brand Logos
├── Favicon
└── Asset Exports
```

---

## Icon Library

The application uses **Lucide React** for all interface icons.

Installation:

```bash
npm install lucide-react
```

Reasons for selecting Lucide React:

- Excellent TypeScript support
- Officially supported by ShadCN/UI
- Tree-shakeable
- Lightweight
- Consistent design language
- Accessible SVG icons
- Large icon collection
- Active community and maintenance

---

## Using Lucide Icons

Import icons directly from the library.

Example:

```tsx
import { CheckCircle, Plus, Trash2 } from "lucide-react";
```

Usage:

```tsx
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Task
</Button>
```

---

## Brand Assets

Custom branding assets are stored separately from Lucide icons.

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

---

## Asset Purpose

| Asset                | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| favicon.svg          | Browser tab favicon                                    |
| app-icon.svg         | Primary application icon                               |
| app-icon-rounded.svg | Rounded application icon for future PWA/mobile support |
| logo-icon.svg        | Compact branding for sidebars and navigation           |
| logo-horizontal.svg  | Primary application logo                               |
| logo.svg             | Master logo asset                                      |

---

## Asset Exports

Brand assets are exported from a single barrel file.

Location:

```text
src/assets/index.ts
```

Example:

```ts
export { default as AppIcon } from "./icons/app-icon.svg";
export { default as AppIconRounded } from "./icons/app-icon-rounded.svg";

export { default as Logo } from "./logos/logo.svg";
export { default as LogoHorizontal } from "./logos/logo-horizontal.svg";
export { default as LogoIcon } from "./logos/logo-icon.svg";
```

Importing assets becomes straightforward:

```tsx
import { LogoHorizontal } from "@/assets";
```

instead of:

```tsx
import LogoHorizontal from "@/assets/logos/logo-horizontal.svg";
```

---

## Naming Conventions

Use descriptive names that reflect the asset's purpose.

Examples:

```text
app-icon.svg

app-icon-rounded.svg

logo.svg

logo-horizontal.svg

logo-icon.svg
```

Avoid ambiguous names such as:

```text
icon.svg

logo-new.svg

logo-final.svg

image.svg
```

---

## Icon Usage Guidelines

### Use Lucide React for

- Buttons
- Navigation
- Menus
- Dialogs
- Forms
- Alerts
- Empty states
- Tables
- Badges
- Status indicators

---

### Use Brand Assets for

- Navbar branding
- Sidebar branding
- Authentication pages
- Splash screens
- Browser favicon
- Documentation
- Marketing materials

---

## Sizing Guidelines

Use Tailwind sizing utilities whenever possible.

| Size        | Tailwind Class | Usage                 |
| ----------- | -------------- | --------------------- |
| Small       | h-4 w-4        | Buttons, inline icons |
| Medium      | h-5 w-5        | Navigation            |
| Large       | h-6 w-6        | Cards, headings       |
| Extra Large | h-8 w-8        | Hero sections         |

Avoid hardcoding width and height values.

---

## Accessibility

Icons should always be accessible.

Decorative icons:

```tsx
<Plus aria-hidden="true" />
```

Informative icons:

```tsx
<AlertTriangle aria-label="Warning" />
```

Logos should include meaningful alternative text.

Example:

```tsx
<img src={LogoHorizontal} alt="Todo Application logo" />
```

---

## Best Practices

- Use Lucide React for interface icons.

- Use SVG assets for branding.

- Import branding assets from `@/assets`.

- Keep icon sizes consistent.

- Use semantic labels where appropriate.

- Prefer SVG over PNG for scalability.

---

## Avoid

Do not:

- Mix multiple icon libraries.
- Use bitmap icons when SVG is available.
- Duplicate branding assets.
- Hardcode icon colors.
- Import assets from deep relative paths.

---

## Future Improvements

Future enhancements may include:

- Animated loading icons
- Theme-aware icon variants
- PWA application icons
- Apple Touch Icons
- Android adaptive icons
- Additional branding assets
- Icon component wrappers
- Figma icon synchronization

---

## Related Files

```text
public/
└── favicon.svg

src/
├── assets/
│   ├── icons/
│   ├── logos/
│   └── index.ts
│
└── App.tsx
```

---

## Related Documentation

```text
application-theme.md

typography.md

colors.md

design-tokens.md
```

The icon system provides a consistent approach to using both interface icons and branding assets throughout the Todo Application. All future UI components should follow these guidelines to maintain visual consistency and accessibility.
