# Job Ad Story Templates

## Overview

Story format job ads (9:16 aspect ratio, 1080x1920px) designed for Instagram Stories, Facebook Stories, and similar vertical video placements.

## Design Source

All variants are pixel-perfect implementations from Figma designs using the **Figma MCP Server** integration.

### Design Philosophy
- **Inspired by Template1**: Design patterns follow the HeroSection.js Template1 style
- **Brand consistency**: Uses same color palette and visual language as landing pages
- **Data-driven**: Pulls information from landingPageData for consistency

## Variant 1 - Purple Gradient Card

### Visual Design
```
┌─────────────────────────────┐
│   [Background Image]        │
│                             │
│                             │
│   [Dark Gradient Overlay]   │
│                             │
├─────────────────────────────┤ ← Rounded corner (80px)
│  👋 WE'RE HIRING            │
│                             │
│  Project Manager            │ ← Gradient text
│                             │
│ [$2,500/mo] [Location]      │ ← Info badges
│     [7 Hours/daily]         │
│                             │
│    [Apply Now Button]       │
│                             │
└─────────────────────────────┘
```

### Key Features

#### 1. **Background Image**
- Full-screen hero image from landing page
- Gradient overlay (dark at bottom for card visibility)
- Respects `imageAdjustment.heroImage.objectPosition` settings

#### 2. **Content Card** (Bottom 759px)
- Background: `#19024c` (deep purple)
- Rounded top-right corner: 80px
- Elevated shadow for depth
- Decorative glow effect at top edge

#### 3. **We're Hiring Tag**
- Waving hand emoji (48px)
- Light purple text (`tertiaryColor`)
- Font: Inter, 36px, Regular

#### 4. **Job Title**
- Gradient text effect (light purple → white)
- Font: Inter, 80px, Semi Bold
- Letter spacing: -3.2px
- Centered alignment

#### 5. **Info Badges** (3 badges)
Each badge has:
- Glass morphism effect (backdrop-blur)
- Gradient background (white 20% → white 6%)
- Purple circular icon container
- White text, 32px, Semi Bold

Badges display:
- **Salary**: Currency symbol, amount, time period
- **Location**: First location from array or single location
- **Hours**: Range or single value with unit

#### 6. **CTA Button**
- Background: `secondaryColor` (purple)
- Padding: 32px vertical, 64px horizontal
- Rounded: 100px (pill shape)
- Font: Inter, 40px, Semi Bold
- Hover effect: Scale 1.05

### Data Mapping

#### Props Accepted
```javascript
{
  variant: {
    title: string,           // Job title
    weAreHiring: string,     // Header text
    callToAction: string,    // Button text
    image: string,           // Background image URL
    salaryMin: string,       // Minimum salary
    salaryMax: string,       // Maximum salary (optional)
    salaryCurrency: string,  // "$", "€", etc.
    salaryTime: string,      // "month", "year", etc.
    salaryRange: boolean,    // Show range or single value
    location: string,        // Location string
    hoursMin: string,        // Minimum hours
    hoursMax: string,        // Maximum hours (optional)
    hoursUnit: string,       // "daily", "weekly", etc.
    hoursRange: boolean,     // Show range or single value
  },
  brandData: {
    companyName: string,     // Used in story frame
    logo: string,            // Company logo URL
    primaryColor: string,    // Brand primary color
    secondaryColor: string,  // Button & icon color
    tertiaryColor: string,   // Accent text color
  },
  landingPageData: {
    // Fallback data source
    vacancyTitle: string,
    weAreHiring: string,
    heroImage: string,
    salaryMin: string,
    salaryMax: string,
    salaryCurrency: string,
    salaryTime: string,
    salaryRange: boolean,
    location: string | string[],
    hoursMin: string,
    hoursMax: string,
    hoursUnit: string,
    hoursRange: boolean,
    imageAdjustment: {
      heroImage: {
        objectPosition: { x: number, y: number }
      }
    }
  }
}
```

### Color Scheme

#### Default Colors (matching Template1)
```javascript
primaryColor: "#2e9eac"    // Teal (not heavily used in this variant)
secondaryColor: "#5e15eb"  // Purple (buttons, icons)
tertiaryColor: "#dbd5fe"   // Light purple (accents)
backgroundColor: "#19024c" // Deep purple (card background)
```

#### Color Usage
- **Card Background**: Deep purple (#19024c)
- **Icon Containers**: Secondary color (purple)
- **Badge Backgrounds**: White gradients with transparency
- **Job Title**: Gradient (light purple → white)
- **We're Hiring**: Tertiary color (light purple)
- **Body Text**: White (#FFFFFF)

### Typography

All text uses **Inter** font family:

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Job Title | 80px | 600 (Semi Bold) | 80px | -3.2px |
| We're Hiring | 36px | 400 (Regular) | 48px | -0.72px |
| Badge Text | 32px | 600 (Semi Bold) | 36px | -0.32px |
| Button Text | 40px | 600 (Semi Bold) | 52px | -0.8px |

### Dimensions

```
Canvas: 1080×1920px (9:16 ratio)

Card:
- Height: 759px
- Width: Full width (1080px)
- Top-right radius: 80px

Content Area:
- Width: 695px
- Left offset: 109px
- Top offset (from card top): 100px

Info Badges Container:
- Width: 634px
- Centered horizontally
- Top offset: 310px

Button:
- Left: 291px
- Top: 566px
- Padding: 32px × 64px
- Border radius: 100px
```

### Responsive Behavior

This template is fixed at 1080×1920px for story format. The StoryFrame wrapper handles scaling for preview purposes.

### Glass Morphism Effect

Info badges use a sophisticated glass effect:
```css
background: linear-gradient(270deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.06) 100%);
backdrop-filter: blur(39.895px);
```

This creates a frosted glass appearance over the background.

### Gradient Effects

#### Job Title Gradient
```css
background: linear-gradient(90deg, rgb(185, 172, 252) 0%, rgb(238, 236, 254) 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

#### Background Overlay Gradient
```css
background: linear-gradient(180deg, rgba(25, 2, 76, 0.3) 0%, rgba(25, 2, 76, 0.8) 50%, rgba(25, 2, 76, 0.95) 100%);
```

#### Decorative Glow (Top of Card)
```css
background: radial-gradient(ellipse at center, [tertiaryColor]40 0%, transparent 70%);
filter: blur(40px);
width: 655px;
height: 178px;
```

## Usage Example

```jsx
import JobAdStoryV1 from './Variant1';

<JobAdStoryV1
  variant={{
    title: "Senior React Developer",
    weAreHiring: "WE'RE HIRING",
    callToAction: "Apply Now",
    image: "/images/office-hero.jpg",
    salaryMin: "80000",
    salaryMax: "120000",
    salaryCurrency: "$",
    salaryTime: "year",
    salaryRange: true,
    location: "San Francisco",
    hoursMin: "40",
    hoursUnit: "weekly",
    hoursRange: false,
  }}
  brandData={{
    companyName: "TechCorp",
    logo: "/logos/techcorp.png",
    primaryColor: "#2e9eac",
    secondaryColor: "#5e15eb",
    tertiaryColor: "#dbd5fe",
  }}
  landingPageData={landingPageData}
/>
```

## Preview Integration

When used in the ads editor, Variant1 is automatically:
1. Loaded via dynamic import in `AdPreview.jsx`
2. Wrapped with `StoryFrame` component (adds story UI)
3. Scaled to fit preview container
4. Ready for export without the frame

## Export Considerations

### What Gets Exported
- Background image with gradient overlay
- Content card (purple)
- All text and badges
- CTA button

### What Doesn't Get Exported
- StoryFrame UI (progress bar, controls, etc.)
- Preview labels or debug info

### Export Specifications
- Format: PNG or MP4 (if animated)
- Dimensions: 1080×1920px
- Color space: sRGB
- DPI: 72 (screen)

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE11: Not supported (uses modern CSS features)

## Performance Notes

- **Image Loading**: Use optimized images (<500KB recommended)
- **Backdrop Filter**: Hardware accelerated on modern browsers
- **Gradient Rendering**: Efficient with CSS gradients
- **Font Loading**: Inter font should be preloaded

## Future Variants

### Variant 2 (Planned)
- Different layout orientation
- Alternative color scheme
- Video background support

### Variant 3 (Planned)
- Minimalist design
- Focus on typography
- Animated elements

## Design Tokens

For consistency across all variants:

```javascript
export const STORY_JOB_AD_TOKENS = {
  canvas: {
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
  },
  card: {
    height: 759,
    borderRadius: '0 80px 0 0',
    backgroundColor: '#19024c',
  },
  spacing: {
    cardLeft: 109,
    cardTop: 100,
    badgeGap: 24,
    iconGap: 14,
  },
  typography: {
    title: {
      size: 80,
      weight: 600,
      lineHeight: 80,
      letterSpacing: -3.2,
    },
    subtitle: {
      size: 36,
      weight: 400,
      lineHeight: 48,
      letterSpacing: -0.72,
    },
    badge: {
      size: 32,
      weight: 600,
      lineHeight: 36,
      letterSpacing: -0.32,
    },
  },
};
```

## Testing Checklist

- [ ] Background image loads correctly
- [ ] All text displays with correct fonts
- [ ] Colors match brand palette
- [ ] Badges show correct data
- [ ] Button is clickable (in interactive preview)
- [ ] Gradient effects render properly
- [ ] Glass morphism effect works
- [ ] Responsive to data changes
- [ ] Exports at correct dimensions
- [ ] Works with StoryFrame wrapper

## Credits

- **Design**: Figma design extracted via MCP Server
- **Template Inspiration**: HeroSection.js Template1
- **Implementation**: Pixel-perfect React component
- **Last Updated**: October 16, 2025


