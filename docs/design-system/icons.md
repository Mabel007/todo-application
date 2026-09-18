## TA-53 Cleanup 8 resolution

Cleanup 8 branding integration: The horizontal application wordmark uses logo-on-light.svg or logo-on-dark.svg. The approved Todo brand mark is the check-circle symbol extracted from the wordmark artwork. The obsolete app-icon.svg and app-icon-rounded.svg assets were removed. public/favicon.svg is the single active browser favicon and uses the extracted check-circle mark. Header sizing is consumer-specific: Header constrains the wordmark height and preserves automatic width. The broader PNG, Apple Touch, Android, and manifest favicon suite is deferred to Epic 10 Production Readiness.

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
    └── logos/
        ├── logo-on-light.svg
        └── logo-on-dark.svg

public/
└── favicon.svg
```

---

## Asset Purpose

| Asset             | Purpose                                                        |
| ----------------- | -------------------------------------------------------------- |
| favicon.svg       | Browser tab favicon                                            |
| logo-on-light.svg | Navy `#0F2458` logo for light backgrounds; current Header logo |
| logo-on-dark.svg  | White approved logo for dark backgrounds                       |

---

## Logo Background Rule

```text
Light background
→ logo-on-light.svg
→ navy #0F2458 artwork

Dark background
→ logo-on-dark.svg
→ white artwork
```

The application currently runs in light theme only. `AppLogo` directly imports and renders `logo-on-light.svg` because the Header uses the light `bg-card` surface.

`logo-on-dark.svg` is the approved counterpart for a dark surface. Runtime dark-theme switching is not implemented, and the presence of the asset does not imply that theme switching is available.

---

## Asset Imports

No asset barrel is currently required. Application code directly imports the specific asset it consumes:

```tsx
import logo from "@/assets/logos/logo-on-light.svg";
```

Direct imports are the current repository convention. They make the selected background-context variant explicit and avoid exporting unused assets.

---

## Naming Conventions

Logo filenames describe the background on which the artwork is intended to appear:

```text
logo-on-light.svg
logo-on-dark.svg
```

The former application-icon names are historical only; app-icon.svg and app-icon-rounded.svg were removed during TA-53 Cleanup 8. Current brand source assets are logo-on-light.svg and logo-on-dark.svg, with public/favicon.svg as the derived browser asset.

```text
app-icon.svg
app-icon-rounded.svg
```

Avoid ambiguous names such as:

```text
logo-light.svg
logo-dark.svg
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
<img src={logo} alt="Todo Application" />
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
  favicon.svg

src/
  assets/
    logos/
      logo-on-light.svg
      logo-on-dark.svg

src/components/layout/AppLogo.tsx
src/components/shared/Header.tsx
```

---

The icon system provides a consistent approach to using both interface icons and branding assets throughout the Todo Application. All future UI components should follow these guidelines to maintain visual consistency and accessibility.
The icon system provides a consistent approach to using both interface icons and branding assets throughout the Todo Application. All future UI components should follow these guidelines to maintain visual consistency and accessibility.
