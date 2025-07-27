# Design Guidelines - Zach Gonser Personal Website

## Overview
This document outlines the design system and layout principles used throughout the website to ensure consistency, maintainability, and visual harmony.

## Design System Architecture

### Color Palette
```css
/* Primary Colors */
--bg-primary: #0a0a0a;        /* Main background - deepest black */
--bg-secondary: #111111;      /* Section backgrounds - charcoal */
--bg-tertiary: #1a1a1a;       /* Card backgrounds - lighter charcoal */

/* Text Colors */
--text-primary: #ffffff;      /* Main headings and important text */
--text-secondary: #d1d5db;    /* Body text and descriptions */
--text-muted: #9ca3af;        /* Subtle text and labels */

/* Accent Colors */
--accent-primary: #a855f7;    /* Purple - primary brand color */
--accent-secondary: #06b6d4;  /* Cyan - secondary accent */
--accent-tertiary: #10b981;   /* Emerald - tertiary accent */

/* Utility Colors */
--border-color: #27272a;      /* Borders and dividers */
--glow: rgba(139, 92, 246, 0.3); /* Glow effects */
```

**Usage Guidelines:**
- Use `--text-primary` for headings and important UI elements
- Use `--text-secondary` for body text and descriptions  
- Use `--text-muted` for labels, captions, and less important text
- Apply accent colors sparingly for highlights and interactive elements
- Maintain sufficient contrast ratios for accessibility

### Spacing Scale (8px Base Unit)
```css
/* Systematic spacing scale based on 8px increments */
--space-xs: 0.5rem;    /* 8px  - tight spacing */
--space-sm: 1rem;      /* 16px - small spacing */
--space-md: 1.5rem;    /* 24px - medium spacing */
--space-lg: 2rem;      /* 32px - large spacing */
--space-xl: 3rem;      /* 48px - extra large spacing */
--space-2xl: 4rem;     /* 64px - section spacing */
--space-3xl: 6rem;     /* 96px - large section spacing */
--space-4xl: 8rem;     /* 128px - hero/major section spacing */
```

**Usage Guidelines:**
- Use `--space-xs` for tight element spacing (margins between small elements)
- Use `--space-sm` to `--space-lg` for component internal spacing
- Use `--space-xl` to `--space-2xl` for spacing between sections
- Use `--space-3xl` to `--space-4xl` for major layout spacing
- Always prefer variables over hardcoded values

### Typography Scale
```css
/* Systematic font sizing */
--text-xs: 0.75rem;     /* 12px - micro text */
--text-sm: 0.875rem;    /* 14px - small text */
--text-base: 1rem;      /* 16px - body text */
--text-lg: 1.125rem;    /* 18px - large body text */
--text-xl: 1.25rem;     /* 20px - small headings */
--text-2xl: 1.5rem;     /* 24px - medium headings */
--text-3xl: 1.875rem;   /* 30px - large headings */
--text-4xl: 2.25rem;    /* 36px - extra large headings */
--text-5xl: 3rem;       /* 48px - hero headings */
--text-6xl: 3.75rem;    /* 60px - massive headings */
```

### Border Radius Scale
```css
/* Systematic border radius sizing */
--radius-sm: 0.5rem;    /* 8px - small radius for tight elements */
--radius-md: 0.75rem;   /* 12px - medium radius for buttons */
--radius-lg: 1rem;      /* 16px - large radius for cards */
--radius-xl: 1.5rem;    /* 24px - extra large radius for containers */
--radius-2xl: 2rem;     /* 32px - major elements */
--radius-full: 50%;     /* circular elements */
```

**Usage Guidelines:**
- Use `--radius-sm` for small UI elements (tags, badges)
- Use `--radius-md` for buttons and form controls
- Use `--radius-lg` for cards and content containers
- Use `--radius-xl` for major sections and hero containers
- Use `--radius-full` for circular elements (avatars, icons)

### Section Background System
```css
/* Consistent section backgrounds with subtle variations */
--bg-hero: linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 50%, rgba(6, 182, 212, 0.03) 100%);
--bg-journey: linear-gradient(180deg, var(--bg-primary) 0%, rgba(17, 17, 17, 0.8) 100%);
--bg-homelab: linear-gradient(45deg, var(--bg-primary) 0%, rgba(30, 41, 59, 0.3) 50%, var(--bg-primary) 100%);
--bg-projects: linear-gradient(90deg, var(--bg-primary) 0%, rgba(139, 92, 246, 0.02) 50%, var(--bg-primary) 100%);
--bg-about: linear-gradient(225deg, var(--bg-primary) 0%, rgba(16, 185, 129, 0.02) 50%, var(--bg-primary) 100%);
--bg-contact: linear-gradient(135deg, var(--bg-primary) 0%, rgba(6, 182, 212, 0.02) 50%, var(--bg-primary) 100%);
```

**Background Philosophy:**
Following the Astro.build approach - consistent base background with subtle gradient variations:
- **Unified Base**: All sections use `--bg-primary` as foundation
- **Subtle Differentiation**: Very light gradient overlays (0.02-0.05 opacity)
- **Varied Directions**: Each section uses different gradient angles for visual interest
- **Consistent Palette**: All gradients use the same accent colors in different combinations
- **No Complex Patterns**: Eliminated distracting radial gradients and geometric patterns

**Usage Guidelines:**
- Use designated `--bg-*` variables for each section type
- Maintain consistent base color across all sections
- Keep gradient overlays very subtle (max 5% opacity)
- Avoid adding additional background patterns or overlays

**Font Families:**
- **Headings**: 'Space Grotesk' - Modern, geometric sans-serif for impact
- **Body Text**: 'Inter' - Highly readable sans-serif optimized for screens

**Usage Guidelines:**
- Use `--text-base` for standard body text
- Use `--text-lg` for emphasized body text and descriptions
- Use `--text-xl` and above for headings in hierarchical order
- Maintain consistent line heights (1.4-1.7) for readability

### Layout Constraints
```css
/* Consistent max-widths for different content types */
--max-width-content: 70rem;     /* 1120px - main content container */
--max-width-text: 48rem;        /* 768px - optimal reading width */
--max-width-narrow: 32rem;      /* 512px - narrow content (forms, etc.) */
```

**Usage Guidelines:**
- Use `--max-width-content` for main page containers
- Use `--max-width-text` for text-heavy content (descriptions, articles)
- Use `--max-width-narrow` for focused content (contact forms, narrow sections)
- Always center containers with `margin: 0 auto`

## Section Structure

### Standard Section Pattern
```css
.section {
  padding: var(--space-4xl) var(--space-md); /* 128px top/bottom, 24px sides */
}

.container {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: 0 var(--space-md);
}

.section-title {
  font-size: clamp(var(--text-4xl), 5vw, var(--text-5xl));
  text-align: center;
  margin-bottom: var(--space-2xl);
}
```

### Hero Section Specifications
- **Min Height**: `100vh` for full viewport coverage
- **Content Max-Width**: `var(--max-width-content)` (70rem)
- **Text Max-Width**: `var(--max-width-text)` (48rem) for description
- **Vertical Centering**: Flexbox with `align-items: center`
- **Button Spacing**: `var(--space-md)` (24px) gap on desktop

## Component Guidelines

### Cards and Interactive Elements
```css
/* Standard card styling */
.card {
  background: var(--glass-bg);
  backdrop-filter: blur(15px);
  border: 1px solid var(--glass-border);
  border-radius: 1rem;
  padding: var(--space-md);
  transition: all 0.3s ease;
}

/* Hover effects */
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--premium-glow);
}
```

### Grid Systems
```css
/* Services/Features Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

/* Project Cards Grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
}
```

## Responsive Design Strategy

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Mobile-First Approach
1. **Stack vertically** on mobile (single column grids)
2. **Reduce spacing** proportionally (use smaller space variables)
3. **Adjust typography** with clamp() functions for fluid scaling
4. **Maintain horizontal stats** even on mobile for visual impact

### Key Responsive Patterns
```css
/* Grid responsive pattern */
.grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile: single column */
  gap: var(--space-sm);
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet: two columns */
    gap: var(--space-md);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop: three columns */
    gap: var(--space-lg);
  }
}
```

## Animation & Interactions

### Standard Transitions
- **Duration**: 0.3s for quick interactions, 0.6s for complex animations
- **Easing**: `ease` for general use, `cubic-bezier(0.4, 0, 0.2, 1)` for sophisticated motion
- **Properties**: `transform`, `opacity`, `box-shadow`, `border-color`

### Hover Effects
- **Subtle lift**: `translateY(-4px)` with enhanced shadow
- **Scale**: `scale(1.02)` for emphasis without disrupting layout
- **Glow**: Use `--premium-glow` variable for consistent lighting effects

## Accessibility Considerations

### Focus States
- Use `--focus-ring` variable for consistent focus indicators
- Ensure focus states are visible and high-contrast
- Test keyboard navigation thoroughly

### Color Contrast
- All text meets WCAG 2.1 AA standards (4.5:1 ratio minimum)
- Test with color blindness simulators
- Don't rely solely on color to convey information

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Include `aria-labels` for interactive elements
- Provide alt text for decorative icons

## Performance Optimization

### CSS Architecture
- Use CSS custom properties for theming
- Minimize use of complex selectors
- Leverage cascade and inheritance
- Group related properties together

### Asset Strategy
- Optimize background gradients and effects
- Use backdrop-filter judiciously (performance cost)
- Minimize animation complexity on mobile devices

## Maintenance Guidelines

### Adding New Components
1. Follow existing naming conventions
2. Use design system variables exclusively
3. Test across all breakpoints
4. Document any new patterns in this file

### Modifying Existing Styles
1. Check impact across all instances
2. Maintain consistency with design system
3. Update documentation if system changes
4. Test accessibility after changes

### Code Organization
```css
/* Recommended CSS structure */
:root {
  /* Design system variables */
}

/* Base styles */
body, headings, etc.

/* Layout components */
.section, .container, .grid

/* UI components */
.card, .button, .form

/* Responsive overrides */
@media queries
```

This design system ensures visual consistency, maintainable code, and excellent user experience across all devices and screen sizes.