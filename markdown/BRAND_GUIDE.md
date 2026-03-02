# Flynt Finance - Brand Guide

## Brand Overview

**Brand Name:** Flynt  
**Tagline:** "Spend Smarter, Save Faster"  
**Positioning:** AI-powered financial control for ambitious Nigerians  
**Tone:** Confident, intelligent, empowering (not patronizing)

---

## Color Palette

### Primary Colors (Extracted from Logo)

**Deep Teal (Primary Brand Color)**
- Hex: `#0D3D3D`
- RGB: `rgb(13, 61, 61)`
- HSL: `hsl(180, 65%, 15%)`
- Usage: Headers, primary buttons, navigation bars, brand backgrounds
- Psychology: Trust, stability, financial security, depth

**Bright Cyan (Accent Color)**
- Hex: `#7FEFEF`
- RGB: `rgb(127, 239, 239)`
- HSL: `hsl(180, 78%, 72%)`
- Usage: CTAs, highlights, success states, interactive elements, logo icon
- Psychology: Innovation, clarity, forward movement, energy

**Teal (Secondary)**
- Hex: `#1A5F5F`
- RGB: `rgb(26, 95, 95)`
- HSL: `hsl(180, 57%, 24%)`
- Usage: Secondary buttons, cards, section backgrounds
- Psychology: Reliability, professionalism

### Extended Palette

**Neutrals:**
- **Charcoal:** `#1F2937` - Primary text
- **Slate Gray:** `#64748B` - Secondary text
- **Light Gray:** `#F1F5F9` - Backgrounds
- **White:** `#FFFFFF` - Cards, surfaces

**Semantic Colors:**
- **Success Green:** `#10B981` - Budget on track, savings goals met
- **Warning Amber:** `#F59E0B` - Budget warnings, approaching limits
- **Error Red:** `#EF4444` - Declined transactions, budget exceeded
- **Info Blue:** `#3B82F6` - Insights, tips, informational messages

### Color Usage Guidelines

**Do's:**
- Use Deep Teal for trust-building elements (security, bank connections)
- Use Bright Cyan sparingly for high-priority actions
- Maintain 4.5:1 contrast ratio for accessibility (WCAG AA)
- Use semantic colors consistently (green = good, red = bad)

**Don'ts:**
- Don't use Bright Cyan for large backgrounds (too intense)
- Don't mix semantic colors (e.g., red for success)
- Don't use low-contrast color combinations
- Don't overuse accent colors (max 20% of screen)

---

## Typography

### Font Families

**Primary Font: Inter**
- Usage: UI, body text, data displays
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- Rationale: Excellent readability, modern, optimized for screens
- Fallback: `system-ui, -apple-system, sans-serif`

**Display Font: Space Grotesk**
- Usage: Headlines, hero sections, marketing
- Weights: 500 (Medium), 700 (Bold)
- Rationale: Geometric, tech-forward, distinctive
- Fallback: `Inter, sans-serif`

**Monospace Font: JetBrains Mono**
- Usage: Card numbers, transaction IDs, code
- Weight: 400 (Regular)
- Rationale: Clear distinction of digits, professional
- Fallback: `Consolas, monospace`

### Type Scale

```css
/* Mobile-first scale */
--text-xs: 0.75rem;    /* 12px - Captions, labels */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Emphasized text */
--text-xl: 1.25rem;    /* 20px - Small headings */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page headings */
--text-4xl: 2.25rem;   /* 36px - Hero headings */
--text-5xl: 3rem;      /* 48px - Marketing hero */

/* Line heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Typography Guidelines

**Hierarchy:**
1. Page title (text-3xl, Bold, Deep Teal)
2. Section heading (text-2xl, Semibold, Charcoal)
3. Card heading (text-xl, Semibold, Charcoal)
4. Body text (text-base, Regular, Charcoal)
5. Secondary text (text-sm, Regular, Slate Gray)
6. Caption (text-xs, Regular, Slate Gray)

**Financial Data Display:**
- Currency amounts: Bold, text-2xl or larger
- Always show currency symbol (₦)
- Use tabular numbers (monospace) for alignment
- Color-code: Green (positive), Red (negative), Charcoal (neutral)

---

## Logo Usage

### Logo Variants

**Primary Logo (Horizontal)**
- Icon + Wordmark
- Usage: App header, website, marketing
- Minimum width: 120px
- Clear space: 20px on all sides

**Icon Only**
- Usage: App icon, favicon, social media avatars
- Minimum size: 32x32px
- Background: Deep Teal or transparent

**Wordmark Only**
- Usage: Limited space contexts
- Minimum width: 80px

### Logo Colors

**On Dark Backgrounds:**
- Icon: Bright Cyan (`#7FEFEF`)
- Wordmark: White (`#FFFFFF`)

**On Light Backgrounds:**
- Icon: Bright Cyan (`#7FEFEF`)
- Wordmark: Deep Teal (`#0D3D3D`)

**Monochrome (when necessary):**
- All white or all Deep Teal

### Logo Don'ts

❌ Don't rotate the logo  
❌ Don't change the icon-to-wordmark ratio  
❌ Don't apply gradients or effects  
❌ Don't place on busy backgrounds without a solid backdrop  
❌ Don't use colors outside the brand palette  

---

## UI Components

### Buttons

**Primary Button**
```css
background: #7FEFEF (Bright Cyan)
color: #0D3D3D (Deep Teal)
padding: 12px 24px
border-radius: 8px
font-weight: 600
hover: darken 10%
```

**Secondary Button**
```css
background: transparent
border: 2px solid #1A5F5F (Teal)
color: #1A5F5F
padding: 12px 24px
border-radius: 8px
font-weight: 600
hover: background #1A5F5F, color white
```

**Danger Button**
```css
background: #EF4444 (Error Red)
color: white
padding: 12px 24px
border-radius: 8px
font-weight: 600
```

### Cards

**Standard Card**
```css
background: white
border: 1px solid #E5E7EB
border-radius: 12px
padding: 20px
box-shadow: 0 1px 3px rgba(0,0,0,0.1)
```

**Elevated Card**
```css
background: white
border: none
border-radius: 16px
padding: 24px
box-shadow: 0 4px 6px rgba(0,0,0,0.07)
```

**Virtual Card Display**
```css
background: linear-gradient(135deg, #0D3D3D 0%, #1A5F5F 100%)
color: white
border-radius: 16px
padding: 24px
aspect-ratio: 1.586 (credit card ratio)
```

### Inputs

**Text Input**
```css
border: 1px solid #D1D5DB
border-radius: 8px
padding: 12px 16px
font-size: 16px
focus: border-color #7FEFEF, ring 2px #7FEFEF20
```

**Input with Icon**
```css
position: relative
icon: absolute left 12px, color #64748B
input: padding-left 44px
```

### Badges

**Status Badges**
- Active: Green background, white text
- Pending: Amber background, white text
- Declined: Red background, white text
- Frozen: Slate background, white text

```css
padding: 4px 12px
border-radius: 12px
font-size: 12px
font-weight: 600
text-transform: uppercase
letter-spacing: 0.5px
```

---

## Iconography

### Icon System

**Library:** Lucide React
**Style:** Outline (2px stroke)
**Sizes:** 16px, 20px, 24px, 32px
**Color:** Inherit from parent or Slate Gray

### Key Icons

- **Wallet:** Budget, accounts
- **CreditCard:** Virtual cards, payments
- **TrendingUp:** Savings, growth
- **TrendingDown:** Spending, decline
- **AlertCircle:** Warnings, insights
- **CheckCircle:** Success, completed
- **XCircle:** Error, declined
- **Eye:** View details
- **EyeOff:** Hide details
- **Lock:** Security, frozen
- **Unlock:** Active, available
- **RefreshCw:** Sync, reload
- **Settings:** Preferences
- **Bell:** Notifications
- **Search:** Marketplace, search

### Icon Guidelines

- Use consistent stroke width (2px)
- Align icons to text baseline
- Add 8px spacing between icon and text
- Use semantic colors for status icons
- Don't mix icon styles (outline vs solid)

---

## Illustrations & Graphics

### Illustration Style

**Characteristics:**
- Flat design with subtle gradients
- Geometric shapes
- Teal and Cyan color palette
- Minimalist, not cluttered
- Human figures: Diverse, modern, aspirational

**Usage:**
- Empty states
- Onboarding screens
- Error pages
- Marketing pages

**Recommended Tools:**
- unDraw (customizable)
- Humaaans (diverse characters)
- Custom illustrations (Figma)

### Data Visualization

**Chart Colors:**
1. Primary: Bright Cyan (`#7FEFEF`)
2. Secondary: Teal (`#1A5F5F`)
3. Tertiary: Success Green (`#10B981`)
4. Quaternary: Info Blue (`#3B82F6`)
5. Quinary: Warning Amber (`#F59E0B`)

**Chart Types:**
- **Line charts:** Spending trends over time
- **Bar charts:** Category comparisons
- **Donut charts:** Budget allocation
- **Area charts:** Cash flow

**Guidelines:**
- Use gradients for area charts (subtle)
- Label axes clearly
- Show data points on hover
- Use color consistently (e.g., Food always same color)

---

## Voice & Tone

### Brand Voice

**Core Attributes:**
- **Intelligent:** Data-driven, insightful, not simplistic
- **Empowering:** "You can do this" not "You're bad with money"
- **Direct:** Clear, concise, no jargon
- **Supportive:** Helpful, not judgmental

### Tone by Context

**Onboarding:**
- Welcoming, encouraging
- "Let's get you set up" not "Complete these steps"

**Budget Warnings:**
- Informative, not alarming
- "You're on track to exceed your food budget by ₦5,000 this week" not "DANGER: OVERSPENDING!"

**Declined Transactions:**
- Explanatory, not punitive
- "This purchase would exceed your discretionary budget. Want to adjust?" not "Transaction declined."

**Insights:**
- Actionable, not preachy
- "You spent ₦12,000 on subscriptions last month. Review them?" not "You're wasting money on subscriptions."

**Success States:**
- Celebratory, not condescending
- "You saved ₦50,000 this month! 🎉" not "Good job saving!"

### Writing Guidelines

**Do's:**
- Use second person ("You saved")
- Use active voice ("Flynt detected" not "Was detected")
- Use specific numbers (₦12,000 not "a lot")
- Use contractions (You're, We'll)
- Use emojis sparingly (celebrations only)

**Don'ts:**
- Don't use financial jargon (APR, amortization)
- Don't blame users ("You overspent")
- Don't use ALL CAPS (except acronyms)
- Don't use exclamation marks excessively
- Don't use passive voice

---

## Motion & Animation

### Animation Principles

**Purpose:** Provide feedback, guide attention, smooth transitions

**Duration:**
- Micro-interactions: 150-200ms
- Page transitions: 300-400ms
- Loading states: 500ms+

**Easing:**
- Ease-out: Elements entering (cubic-bezier(0, 0, 0.2, 1))
- Ease-in: Elements exiting (cubic-bezier(0.4, 0, 1, 1))
- Ease-in-out: Elements moving (cubic-bezier(0.4, 0, 0.2, 1))

### Key Animations

**Button Press:**
```css
transform: scale(0.98)
duration: 150ms
```

**Card Hover:**
```css
transform: translateY(-2px)
box-shadow: 0 8px 12px rgba(0,0,0,0.1)
duration: 200ms
```

**Page Transition:**
```css
opacity: 0 → 1
transform: translateY(10px) → translateY(0)
duration: 300ms
```

**Loading Spinner:**
```css
animation: spin 1s linear infinite
color: Bright Cyan
```

**Success Checkmark:**
```css
animation: draw 400ms ease-out
color: Success Green
```

### Animation Guidelines

- Don't animate large elements (causes jank)
- Respect `prefers-reduced-motion`
- Use CSS transforms (GPU-accelerated)
- Avoid animating width/height (use scale)
- Test on low-end devices

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Tested Combinations:**
✅ Deep Teal on White: 9.2:1  
✅ Charcoal on White: 12.6:1  
✅ Slate Gray on White: 4.7:1  
✅ White on Deep Teal: 9.2:1  
✅ Deep Teal on Bright Cyan: 4.8:1  
❌ Bright Cyan on White: 1.8:1 (use for accents only, not text)

**Keyboard Navigation:**
- All interactive elements focusable
- Visible focus indicators (2px Bright Cyan ring)
- Logical tab order
- Skip links for navigation

**Screen Readers:**
- Semantic HTML (nav, main, article)
- ARIA labels for icons
- Alt text for images
- Live regions for dynamic content

**Touch Targets:**
- Minimum 44x44px (iOS)
- Minimum 48x48px (Android)
- 8px spacing between targets

---

## Responsive Design

### Breakpoints

```css
/* Mobile first */
--mobile: 0px        /* 320px - 639px */
--tablet: 640px      /* 640px - 1023px */
--desktop: 1024px    /* 1024px - 1279px */
--wide: 1280px       /* 1280px+ */
```

### Layout Guidelines

**Mobile (320-639px):**
- Single column
- Full-width cards
- Bottom navigation
- Collapsible sections

**Tablet (640-1023px):**
- Two columns for lists
- Side navigation (collapsible)
- Larger touch targets

**Desktop (1024px+):**
- Three columns for dashboards
- Persistent side navigation
- Hover states
- Keyboard shortcuts

### Typography Scaling

**Mobile:**
- Body: 16px (never smaller)
- Headings: Scale down 20%

**Desktop:**
- Body: 16px
- Headings: Full scale

---

## Component Library

### Recommended Stack

**Web:**
- **shadcn/ui** (Radix UI primitives + Tailwind)
- Customized with Flynt colors
- Accessible by default

**Mobile:**
- **React Native Paper** (Material Design)
- Customized theme
- Platform-specific adaptations

### Core Components

1. **Button** (Primary, Secondary, Danger, Ghost)
2. **Card** (Standard, Elevated, Virtual Card)
3. **Input** (Text, Number, Password, Search)
4. **Select** (Dropdown, Multi-select)
5. **Badge** (Status, Category)
6. **Alert** (Info, Success, Warning, Error)
7. **Modal** (Dialog, Bottom Sheet)
8. **Navigation** (Top bar, Bottom bar, Side nav)
9. **Chart** (Line, Bar, Donut, Area)
10. **List** (Transaction list, Account list)

---

## Brand Applications

### App Icon

**Design:**
- Icon only (three stacked bars)
- Bright Cyan on Deep Teal background
- Rounded square (iOS), adaptive icon (Android)

**Sizes:**
- iOS: 1024x1024px (export all sizes)
- Android: 512x512px (adaptive)
- Web: 512x512px (PWA)

### Splash Screen

**Design:**
- Deep Teal background
- Centered logo (icon + wordmark)
- Bright Cyan accent
- Fade-out animation (300ms)

### Marketing Materials

**Business Cards:**
- Front: Logo, name, title
- Back: Deep Teal background, contact info in white

**Pitch Deck:**
- Cover: Deep Teal background, logo, tagline
- Content: White background, Teal accents
- Charts: Brand colors

**Social Media:**
- Profile picture: Icon only
- Cover photo: Logo + tagline on Deep Teal
- Post templates: Bright Cyan accents

---

## File Naming Conventions

### Images
```
logo-horizontal-light.svg
logo-horizontal-dark.svg
logo-icon-only.svg
logo-wordmark-only.svg
icon-wallet-24.svg
illustration-onboarding-1.svg
```

### Colors
```
color-primary-deep-teal.png
color-accent-bright-cyan.png
color-semantic-success.png
```

### Components
```
button-primary.png
card-virtual-card.png
input-text-default.png
```

---

## Brand Checklist

Before launching any design, verify:

- [ ] Colors match brand palette (no random colors)
- [ ] Typography uses Inter or Space Grotesk
- [ ] Logo has proper clear space
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] Touch targets are 44x44px minimum
- [ ] Animations respect reduced motion
- [ ] Copy matches brand voice (empowering, not judgmental)
- [ ] Icons are from Lucide (consistent style)
- [ ] Responsive on mobile, tablet, desktop
- [ ] Tested with screen reader

---

## Design Resources

### Figma File Structure

```
📁 Flynt Design System
  📄 Cover
  📄 Brand Guidelines
  📄 Color Palette
  📄 Typography
  📄 Components
    - Buttons
    - Cards
    - Inputs
    - Navigation
  📄 Screens (Mobile)
  📄 Screens (Web)
  📄 Illustrations
  📄 Icons
```

### Export Settings

**SVG:**
- Outline strokes
- Flatten transforms
- Minify

**PNG:**
- @1x, @2x, @3x (mobile)
- Transparent background
- Optimize with TinyPNG

**Fonts:**
- WOFF2 format
- Subset to Latin + Latin Extended
- Self-host (don't use Google Fonts CDN)

---

## Version History

**v1.0** - January 31, 2026
- Initial brand guide
- Color palette from logo
- Typography system
- Component guidelines
- Accessibility standards

---

**Maintained by:** Design Team  
**Contact:** design@flynt.finance  
**Last Updated:** January 31, 2026
