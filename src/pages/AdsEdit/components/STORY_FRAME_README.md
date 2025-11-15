# StoryFrame Component

## Overview

The `StoryFrame` component provides a realistic Instagram/Facebook Stories UI overlay for ad previews. It wraps your ad content with authentic platform UI elements to give stakeholders and clients a better sense of how the ad will appear in the real environment.

## Important: UI vs Ad Content

⚠️ **The StoryFrame UI elements are NOT part of the actual ad creative.** They are preview-only decorations to simulate the platform experience.

### What's in the Frame (NOT exported with the ad):
- **Progress bar** at the top showing story position
- **Profile section** with logo, brand name, and time posted ("14h")
- **Control buttons**: Pause, Audio/Volume, More Options (3 dots)
- **Gradient overlays** for better text readability

### What's the Ad (exported as creative):
- Everything passed as `children` to the `StoryFrame` component
- Your actual ad template content
- Images, text, CTAs, and brand elements

## Usage

```jsx
import StoryFrame from "./StoryFrame";

// Wrap your story-format ad content with StoryFrame
<StoryFrame brandData={brandData}>
  {/* Your actual ad content here */}
  <YourAdTemplate variant={variant} />
</StoryFrame>
```

## Props

### `children` (required)
- Type: `React.ReactNode`
- The actual ad content to be displayed

### `brandData` (optional)
- Type: `Object`
- Brand information for the story header
- Properties used:
  - `companyName` or `name`: Display name in header
  - `logo` or `companyLogo`: Profile picture/logo
- Falls back to "hirelab" and default logo if not provided

## Integration with AdPreview

The `StoryFrame` is automatically applied to all story format ads (9:16 aspect ratio) in the `AdPreview` component:

```jsx
// AdPreview.jsx automatically detects story format
const isStoryFormat = format?.id === 'story' || format?.aspectRatio === '9:16';

if (isStoryFormat) {
  return <StoryFrame brandData={brandData}>{adContent}</StoryFrame>;
} else {
  return adContent; // Square and landscape formats without frame
}
```

## UI Elements Detail

### Progress Bar
- Shows 3 segments (simulating multiple stories)
- First segment animated to 65% (current story)
- Remaining segments at 0% (upcoming stories)

### Profile Header
- **Logo**: 32px circular avatar with gradient border
- **Brand Name**: Bold white text
- **Time**: "14h" placeholder (static for preview)

### Controls
- **Pause Button**: Two vertical bars icon
- **Audio Button**: Speaker with sound waves
- **More Options**: Three vertical dots
- All buttons have hover states for interactivity

### Visual Enhancements
- Drop shadows on text for readability
- Bottom gradient overlay (black to transparent)
- Rounded corners maintained
- Pointer events disabled on overlay (except controls)

## Customization

To modify the frame appearance, edit `StoryFrame.jsx`:

```jsx
// Change progress bar color
className="h-full bg-white"  // Currently white

// Adjust profile picture border gradient
className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"

// Modify time posted
const timePosted = "14h";  // Change to any value

// Remove preview label
// Comment out or delete the "Preview Label" div at the bottom
```

## Export Considerations

When exporting ads for actual use:
1. **Don't export the StoryFrame** - only export the `children` content
2. The frame is for **preview purposes only**
3. Social media platforms provide their own story UI
4. Your exported creative should be the raw content (1080x1920px for stories)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires CSS Grid and Flexbox support
- Uses standard SVG icons (no external dependencies)
- Responsive within the preview container

## Example Workflow

1. User creates story ad content
2. Content is passed to `AdPreview` component
3. `AdPreview` detects story format (9:16)
4. Automatically wraps content with `StoryFrame`
5. User sees realistic story preview with UI elements
6. When exporting, only the actual ad content is exported

## Future Enhancements

Potential improvements:
- [ ] Animated progress bar that auto-advances
- [ ] Multiple platform styles (Instagram vs Facebook vs Snapchat)
- [ ] Interactive controls (pause, mute, etc.)
- [ ] Customizable time posted text
- [ ] Support for verified badges
- [ ] Sponsored tag option
- [ ] Swipe-up indicator for link ads



