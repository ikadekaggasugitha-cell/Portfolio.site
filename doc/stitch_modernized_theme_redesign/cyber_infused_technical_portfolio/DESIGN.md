---
name: Cyber-Infused Technical Portfolio
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#b0c6ff'
  on-secondary: '#002d6e'
  secondary-container: '#0068ed'
  on-secondary-container: '#f2f3ff'
  tertiary: '#e8ecff'
  on-tertiary: '#283044'
  tertiary-container: '#c8d0ea'
  on-tertiary-container: '#51596f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b0c6ff'
  on-secondary-fixed: '#001945'
  on-secondary-fixed-variant: '#00429b'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  headline-xl:
    fontFamily: JetBrains Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: JetBrains Mono
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style
The design system is engineered for high-stakes IT professionals specializing in Cybersecurity, Cloud Computing, and Software Development. The brand personality is clinical, precise, and authoritative, evoking the feeling of a sophisticated command center or a high-end IDE.

The visual style is **Modern Corporate with Technical Accents**, blending "Glassmorphism" for depth and "Minimalism" for structural clarity. It leverages a dark-mode-first approach to reduce eye strain during technical reviews and uses vibrant light-emitting accents to guide the user's eye to key performance indicators and calls to action. The emotional response should be one of absolute trust in technical competence and forward-thinking innovation.

## Colors
The palette is built on a foundation of deep, layered slates to create a sense of infinite digital space.

- **Primary (#00E5FF):** An electric Cyan used for high-priority actions, status indicators (Active/Secure), and technical highlights.
- **Secondary (#2979FF):** A vibrant Royal Blue for links, primary buttons, and decorative data visualizations.
- **Background/Tertiary (#0F172A):** A deep Navy Slate that serves as the canvas for all components.
- **Neutral (#94A3B8):** Low-contrast gray for secondary text and metadata, ensuring the primary content remains the focus.
- **Success/Warning/Error:** Use specialized tech-tints of Green (#10B981), Amber (#F59E0B), and Red (#EF4444) for system alerts and security status.

## Typography
This design system utilizes a dual-font strategy to balance readability with a "developer" aesthetic.

- **Headlines & Labels:** JetBrains Mono provides the technical "code-like" DNA. Use it for titles, section headers, and data labels to reinforce the IT focus.
- **Body Text:** Inter is utilized for all long-form content and descriptions to ensure maximum legibility and a professional, modern feel.
- **Hierarchy:** Maintain high contrast between font weights. Use uppercase for labels to create a "terminal" look without sacrificing accessibility.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid Grid**. 
- **Desktop:** A 12-column grid centered in a 1280px container.
- **Tablet:** 8 columns with 32px side margins.
- **Mobile:** 4 columns with 16px side margins.

Spacing follows a strict 8px linear scale. Large vertical gaps (Section 5 or 'xl') are used between project blocks to provide breathing room and emphasize individual case studies. Use tight spacing (Section 1 or 'xs') for data points and code snippets to maintain a "dense info" aesthetic.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Glassmorphism**, avoiding traditional heavy shadows in favor of luminosity.

- **Level 0 (Background):** Solid #0F172A.
- **Level 1 (Cards):** #1E293B at 60% opacity with a `backdrop-filter: blur(12px)`.
- **Level 2 (Modals/Popovers):** #334155 at 80% opacity with a 1px border colored at #38B2AC (20% opacity).
- **Accents:** Use a subtle "inner glow" (box-shadow: inset 0 1px 0 rgba(255,255,255,0.05)) on interactive elements to simulate high-end hardware interfaces.

## Shapes
The shape language is **Technical and Precise**. 
- **Standard Radius:** 4px (Soft) is the default for buttons and inputs, providing a modern but structured appearance.
- **Container Radius:** 8px (Large) for cards and sections.
- **Utility Shapes:** Use 45-degree chamfered corners (clipped corners) sparingly on decorative elements to evoke a futuristic, aerospace, or cybersecurity aesthetic.

## Components
- **Buttons:** Primary buttons use a solid gradient from Secondary Blue to Primary Cyan. Ghost buttons use a 1px Primary Cyan border with JetBrains Mono text.
- **Cards:** Glassmorphic backgrounds with a 1px subtle top border to catch the "light." Content should be padded by 24px (md).
- **Chips/Tags:** Small 4px rounded rectangles with background-tinted versions of primary colors (e.g., Cyan background at 10% opacity with Cyan text). Use for "Tech Stack" tags.
- **Inputs:** Darker than the background (#020617), 1px Slate border that glows Primary Cyan on focus.
- **Status Indicators:** Small pulsing circles to indicate "System Live" or "Project Active" status, utilizing the Primary Cyan color.
- **Code Blocks:** Syntax highlighting should use a custom theme matching the design system colors, housed in a rounded-sm container with a "Copy" utility label.