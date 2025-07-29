# Origo Design System

## Overview

The Origo Design System is a comprehensive design system built with LinkedIn-inspired colors, modern typography, and reusable components. It provides a consistent foundation for building user interfaces with a focus on accessibility, performance, and maintainability.

## 🎨 Color System

### Brand Colors

Our color system is inspired by LinkedIn's professional aesthetic while maintaining our own unique identity.

#### Primary Colors
- **Primary**: `#0073e6` - Main brand color for CTAs and important actions
- **Secondary**: `#4080ff` - Supporting brand color for secondary actions
- **Tertiary**: `#ff8040` - Accent color for highlights and special elements

#### Semantic Colors
- **Success**: `#50ff74` - Positive actions and confirmations
- **Warning**: `#ffbe40` - Caution and attention states
- **Error**: `#ff4040` - Errors and destructive actions
- **Info**: `#4080ff` - Informational content and links

#### Neutral Colors
- **Gray Scale**: 50-900 range for text, backgrounds, and borders
- **Dark Theme**: Specialized colors for dark mode support

### Usage

```css
/* Using CSS Custom Properties */
.button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Using Utility Classes */
.primary-button {
  @apply bg-primary text-white;
}
```

## 📝 Typography

### Font Families

- **Primary**: Inter - Modern, readable sans-serif for UI
- **Secondary**: SF Pro Display - Apple system font fallback
- **Monospace**: JetBrains Mono - Code and technical content

### Type Scale

| Class | Size | Weight | Use Case |
|-------|------|--------|----------|
| `heading-1` | 2.25rem | Bold | Page titles |
| `heading-2` | 1.875rem | Semibold | Section headers |
| `heading-3` | 1.5rem | Semibold | Subsection headers |
| `heading-4` | 1.25rem | Medium | Card titles |
| `heading-5` | 1.125rem | Medium | Form labels |
| `heading-6` | 1rem | Medium | Small headers |
| `body-large` | 1.125rem | Normal | Lead paragraphs |
| `body-medium` | 1rem | Normal | Body text |
| `body-small` | 0.875rem | Normal | Captions |
| `body-xs` | 0.75rem | Normal | Metadata |

### Usage

```jsx
import { Heading1, BodyMedium } from './components/Typography';

<Heading1>Page Title</Heading1>
<BodyMedium>This is body text with proper spacing and color.</BodyMedium>
```

## 🔘 Buttons

### Variants

- **Primary**: Main actions and CTAs
- **Secondary**: Supporting actions
- **Tertiary**: Subtle actions
- **Success**: Positive actions
- **Warning**: Caution actions
- **Error**: Destructive actions
- **Ghost**: Minimal styling

### Sizes

- **xs**: 0.375rem padding
- **sm**: 0.5rem padding
- **md**: 0.75rem padding (default)
- **lg**: 1rem padding
- **xl**: 1.25rem padding

### States

- **Normal**: Default state
- **Hover**: Enhanced visual feedback
- **Active**: Pressed state
- **Disabled**: Non-interactive state
- **Loading**: With spinner animation

### Usage

```jsx
import Button from './components/Button';

// Basic usage
<Button variant="primary" size="md">
  Click Me
</Button>

// With icon
<Button icon={<Plus />} variant="secondary">
  Add Item
</Button>

// Loading state
<Button loading={isLoading} onClick={handleSubmit}>
  Submit
</Button>

// Icon only
<Button icon={<Settings />} />
```

## 🔗 Links

### Variants

- **Primary**: Main navigation and important links
- **Secondary**: Supporting links
- **Tertiary**: Subtle links

### Types

- **Internal**: Router navigation
- **External**: External URLs with security attributes
- **Anchor**: Standard anchor links

### Usage

```jsx
import Link from './components/Link';

// Internal navigation
<Link to="/dashboard" variant="primary">
  Go to Dashboard
</Link>

// External link
<Link href="https://github.com" external variant="secondary">
  View on GitHub
</Link>

// Standard anchor
<Link href="#section" variant="tertiary">
  Jump to Section
</Link>
```

## 🎯 Components

### Button Component

```jsx
<Button
  variant="primary"           // primary, secondary, tertiary, success, warning, error, ghost
  size="md"                   // xs, sm, md, lg, xl
  disabled={false}            // Disabled state
  loading={false}             // Loading state with spinner
  icon={<Icon />}            // Icon element
  iconPosition="left"         // left, right
  fullWidth={false}           // Full width button
  onClick={handleClick}       // Click handler
  type="button"              // button, submit, reset
>
  Button Text
</Button>
```

### Typography Component

```jsx
<Typography
  variant="body-medium"       // All typography variants
  as="p"                     // HTML element override
  className="custom-class"    // Additional classes
>
  Typography content
</Typography>

// Convenience components
<Heading1>Title</Heading1>
<BodyMedium>Content</BodyMedium>
```

### Link Component

```jsx
<Link
  variant="primary"           // primary, secondary, tertiary
  href="https://example.com" // External URL
  to="/internal-route"        // Internal route
  external={false}            // External link with security
  className="custom-class"    // Additional classes
>
  Link Text
</Link>
```

## 🎨 CSS Custom Properties

### Color Variables

```css
/* Brand Colors */
--color-primary: #0073e6;
--color-secondary: #4080ff;
--color-tertiary: #ff8040;

/* Semantic Colors */
--color-success: #50ff74;
--color-warning: #ffbe40;
--color-error: #ff4040;
--color-info: #4080ff;

/* Text Colors */
--color-text-primary: #111827;
--color-text-secondary: #374151;
--color-text-tertiary: #6b7280;
--color-text-inverse: #ffffff;

/* Background Colors */
--color-bg-primary: #ffffff;
--color-bg-secondary: #f9fafb;
--color-bg-tertiary: #f3f4f6;
```

### Typography Variables

```css
/* Font Families */
--font-family-primary: 'Inter', sans-serif;
--font-family-secondary: 'SF Pro Display', sans-serif;
--font-family-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
--font-size-4xl: 2.25rem;
--font-size-5xl: 3rem;
--font-size-6xl: 3.75rem;

/* Font Weights */
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-extrabold: 800;
```

## 🎭 Dark Theme Support

The design system includes built-in dark theme support using CSS custom properties and the `[data-theme="dark"]` selector.

```css
[data-theme="dark"] {
  --color-bg-primary: var(--color-dark-100);
  --color-bg-secondary: var(--color-dark-200);
  --color-text-primary: var(--color-dark-900);
  --color-text-secondary: var(--color-dark-700);
}
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: < 640px
- **Tablet**: 641px - 1024px
- **Desktop**: > 1025px

### Utility Classes

```css
/* Responsive containers */
.container {
  padding-left: 1rem;    /* Mobile */
  padding-left: 2rem;    /* Tablet */
  padding-left: 3rem;    /* Desktop */
}
```

## ♿ Accessibility

### Focus Management

- All interactive elements have visible focus indicators
- Focus outlines use brand colors for consistency
- Keyboard navigation is fully supported

### Color Contrast

- All text meets WCAG AA contrast requirements
- Color combinations are tested for accessibility
- Semantic colors provide clear meaning

### Screen Reader Support

- Proper ARIA labels and roles
- Semantic HTML structure
- Descriptive alt text for images

## 🚀 Performance

### CSS Optimization

- CSS Custom Properties for dynamic theming
- Minimal CSS bundle size
- Efficient selectors and specificity

### Component Optimization

- React.memo for performance
- Lazy loading support
- Minimal re-renders

## 🛠️ Development

### File Structure

```
src/
├── components/
│   ├── Button.jsx
│   ├── Typography.jsx
│   ├── Link.jsx
│   └── DesignSystemShowcase.jsx
├── styles/
│   └── design-system.css
└── utils/
    └── constants.js
```

### Adding New Components

1. Create component in `src/components/`
2. Add CSS classes to `src/styles/design-system.css`
3. Update documentation
4. Add to showcase component

### Best Practices

- Use CSS Custom Properties for theming
- Follow naming conventions
- Include accessibility features
- Test across browsers
- Document props and usage

## 📚 Resources

- **Design System Showcase**: `/design-system`
- **Color Palette**: See showcase for all colors
- **Typography Scale**: Complete type scale examples
- **Component Library**: All reusable components

## 🤝 Contributing

When contributing to the design system:

1. Follow existing patterns
2. Update documentation
3. Test accessibility
4. Ensure responsive design
5. Add to showcase component

## 📄 License

This design system is part of the Origo project and follows the same licensing terms. 