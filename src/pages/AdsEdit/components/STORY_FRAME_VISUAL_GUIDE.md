# Story Frame Visual Guide

## Complete UI Layout

```
┌─────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Progress bars (3 segments)
│                                             │
│ 👤 hirelab        14h      ⏸️  🔊  ⋮       │ ← Header section
│ ────────────────────────────────────────    │
│                                             │
│                                             │
│                                             │
│                                             │
│                                             │
│           [AD CONTENT AREA]                 │
│                                             │
│          (Your actual ad creative           │
│           gets rendered here)               │
│                                             │
│                                             │
│                                             │
│                                             │
│ ░░░░░░░░░░░░ Bottom Gradient ░░░░░░░░░░░░  │ ← Readability overlay
└─────────────────────────────────────────────┘
```

## Header Breakdown (Top 60px)

### Progress Bar Section (12px tall)
```
┌─────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ ░░░░░░░░░░ ░░░░░░░░░░          │
│   Story 1      Story 2     Story 3          │
│  (65% done)   (queued)    (queued)          │
└─────────────────────────────────────────────┘
```
- **Gap between bars**: 4px
- **Height**: 2px
- **Border radius**: Full (rounded pill)
- **Active color**: White (#FFFFFF)
- **Inactive color**: White 30% opacity (rgba(255,255,255,0.3))

### Profile & Controls Section (36px tall)
```
┌──────────────────────────────────────────────────────────┐
│  ┌────┐                                                   │
│  │ 🏢 │ hirelab    14h              ⏸️      🔊      ⋮    │
│  └────┘                                                   │
│ Profile  Name      Time             Pause   Audio   More  │
└──────────────────────────────────────────────────────────┘
```

## Component Specifications

### 1. Profile Picture (Left Side)
```
┌────────────────────┐
│  ┌──────────────┐  │
│  │ ┏━━━━━━━━┓  │  │ ← Gradient border ring
│  │ ┃  LOGO  ┃  │  │ ← Actual logo
│  │ ┗━━━━━━━━┛  │  │
│  └──────────────┘  │
└────────────────────┘

Outer ring: 32×32px
Inner circle: 30×30px
Border: 2px gradient (purple→pink→orange)
```

**CSS**:
- Outer div: `w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5`
- Inner div: `w-full h-full rounded-full bg-black flex items-center justify-center`

### 2. Brand Name & Time
```
  hirelab    14h
  ──────┬   ──┬─
   │         │
   │         └─ Time posted (static)
   └─────────── Brand/company name
```

**Text Styles**:
- Brand name: `text-sm font-semibold text-white drop-shadow-lg`
- Time: `text-sm text-white/80 drop-shadow-lg`
- Gap: 6px (`gap-1.5`)

### 3. Control Buttons (Right Side)

#### Pause Button
```
┌─────┐
│ ┃┃  │  36×36px hit area
└─────┘  20×20px icon
```
**Icon**: Two vertical rectangles (4px wide, 16px tall, 1px radius)
**SVG**: `<rect x="6" y="4" width="4" height="16" rx="1" fill="white" />`

#### Audio Button
```
┌─────┐
│ 🔊  │  Speaker with sound waves
└─────┘
```
**Icon**: Speaker cone + 2 curved sound wave lines
**Size**: 20×20px icon in 36×36px button

#### More Options Button
```
┌─────┐
│  ⋮  │  Three vertical dots
└─────┘
```
**Icon**: 3 circles (1.5px radius each, vertical stack)
**Spacing**: 12px, 19px (y-positions at 5, 12, 19)

## Ad Content Area

### Dimensions
```
Full canvas: 1080×1920px (9:16)
Safe area:   1000×1700px

┌───────────────────────┐ ← 0px
│ [Reserved: 60px]      │ ← Header area
├───────────────────────┤ ← 60px
│                       │
│                       │
│   Safe area for       │
│   ad content starts   │
│   around here         │
│                       │
│   Your ad creative    │
│   renders in this     │
│   full space          │
│                       │
├───────────────────────┤ ← 1792px
│ [Reserved: 128px]     │ ← Bottom gradient
└───────────────────────┘ ← 1920px
```

**Note**: Ad content uses full height, but header/footer overlays are positioned absolutely on top.

## Bottom Gradient Overlay

### Purpose
Provides contrast for text CTAs or swipe-up indicators

### Specifications
```
┌─────────────────────────────────────┐
│                                     │ ← Transparent
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │ ← Gradient
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Black 40%
└─────────────────────────────────────┘
```

**CSS**: `bg-gradient-to-t from-black/40 to-transparent`
**Height**: 128px (h-32)
**Position**: `absolute bottom-0 left-0 right-0`

## Color Palette

### Main Colors
```
White (UI):           #FFFFFF
White 80% (time):     rgba(255, 255, 255, 0.8)
White 30% (inactive): rgba(255, 255, 255, 0.3)
White 10% (hover):    rgba(255, 255, 255, 0.1)
Black overlay:        rgba(0, 0, 0, 0.4)
```

### Gradient Border
```
from-purple-500:  #A855F7
via-pink-500:     #EC4899
to-orange-500:    #F97316
```

## Interactive States

### Button Hover
```
Default:        transparent
Hover:          rgba(255, 255, 255, 0.1)
Transition:     200ms ease
Border radius:  9999px (full circle)
```

### Progress Bar Animation
```
Initial:        width: 0%
Current:        width: 65%
Duration:       5s (in real implementation)
Timing:         linear
```

## Spacing & Layout

### Padding
```
Header section:  12px all sides (px-3 pt-3)
Ad content:      No padding (full bleed)
Bottom overlay:  0px padding
```

### Gaps
```
Progress segments:        4px (gap-1)
Profile to name:          8px (gap-2)
Name to time:             6px (gap-1.5)
Control buttons:          8px (gap-2)
```

### Z-Index Layers
```
Layer 0:  Ad content      (z-0)
Layer 10: Story UI        (z-10)
Layer 20: Preview label   (z-20)
```

## Typography

### Font Sizes
```
Brand name:    14px (text-sm)
Time posted:   14px (text-sm)
Preview label: 10px (text-[10px])
```

### Font Weights
```
Brand name:    600 (font-semibold)
Time posted:   400 (normal)
Preview label: 400 (normal)
```

### Text Effects
```
Drop shadow:  drop-shadow-lg
             (0 10px 15px rgba(0,0,0,0.1))
```

## Export vs Preview

### In Preview Mode
```
┌─────────────────────────────────┐
│ ▓▓▓ UI overlay visible           │ ← Shown
│ 👤 hirelab 14h  ⏸ 🔊 ⋮          │ ← Shown
├─────────────────────────────────┤
│    [Ad Content]                  │ ← Shown
└─────────────────────────────────┘
```

### In Export Mode
```
┌─────────────────────────────────┐
│    [Ad Content]                  │ ← Only this
│                                  │
│    (Full 1080×1920px)           │
└─────────────────────────────────┘
```

## Implementation Notes

### Pointer Events
```css
.story-overlay {
  pointer-events: none;  /* UI doesn't block clicks */
}

.control-button {
  pointer-events: auto;  /* Buttons are clickable */
}
```

### Responsive Behavior
- Frame scales with container
- Maintains 9:16 aspect ratio
- All elements scale proportionally
- Text remains readable at all sizes

### Accessibility
- Control buttons have proper hit areas (36×36px minimum)
- Icons use semantic SVG markup
- Text has sufficient contrast (white on gradient/dark backgrounds)
- Fallback for missing images (initial letter display)

## Platform Variations

### Instagram Stories
- Gradient profile ring (purple→pink→orange) ✅ Implemented
- Time posted (e.g., "14h") ✅ Implemented
- Control buttons on right ✅ Implemented

### Facebook Stories
- Similar layout to Instagram
- Slightly different button styles
- Could be added as variant prop

### Snapchat Stories
- Different UI style (more minimal)
- Could be future enhancement

## Testing Checklist

- [ ] Progress bar displays correctly (3 segments, first at 65%)
- [ ] Brand logo loads or shows fallback
- [ ] Brand name truncates if too long
- [ ] Time displays correctly ("14h")
- [ ] Pause button renders SVG icon
- [ ] Audio button renders SVG icon
- [ ] More options button renders dots
- [ ] Buttons show hover state
- [ ] Bottom gradient doesn't cover important content
- [ ] Frame scales properly in preview
- [ ] Ad content renders within frame
- [ ] No layout shift when loading

---

**This visual guide provides exact specifications for all StoryFrame UI elements.**



