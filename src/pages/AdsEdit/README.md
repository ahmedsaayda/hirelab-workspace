# Creative Automation V2 - Ads Editor

## Overview

The Creative Automation V2 system enables users to automatically generate, manage, and optimize ad creatives for recruitment campaigns across multiple platforms. This feature creates a closed-loop recruitment funnel from ATS → Landing Page → Form → Ads → Campaign Launch.

## Flow Diagram

```
ATS Job Data → HireLab Page Builder → Form Builder → Ads Editor → Campaign Launch
                                                           ↓
                                              Applicant tracking & Attribution
```

## Ad Funnel Strategy

The system implements a sequential ad funnel based on audience warmth:

### Stage 1: Cold Audience (Top of Funnel)
- **Ad Type:** Job Ad (Direct Apply)
- **Goal:** Drive first visits to the job page
- **Target:** Lookalike audiences, interest-based targeting, ATS CRM lists
- **Message:** Role-specific, "Now Hiring", short copy, strong CTA

### Stage 2: Warm Audience (Retargeting Stage 1)
- **Ad Types:**
  - Employer Brand Ad: Team culture, mission, behind-the-scenes
  - Testimonial Ad: Employee stories, same department/location
- **Goal:** Build emotional trust, help candidates picture themselves in role/company
- **Target:** People who clicked Stage 1 ads

### Stage 3: Hot Audience (Retargeting Stage 2)
- **Ad Type:** Company Branding Ad
- **Goal:** Remove hesitation, make employer memorable, push to apply
- **Target:** People who viewed Stage 2 ads
- **Message:** Strong EVP pitch, benefits, "why work here" differentiators

### Stage 4: Conversion Push (Final Retargeting)
- **Ad Type:** Job Ad Retargeting
- **Goal:** Get fence-sitters to complete application
- **Target:** Page visitors & form starters who didn't finish
- **Message:** Urgency ("Last chance", "Applications closing soon")

## Features

### 1. Ad Type Management
- **Job Ads:** Direct apply ads for active job seekers
- **Employer Brand:** Culture and mission showcase
- **Testimonials:** Real employee stories
- **About Company:** EVP and benefits highlighting
- **Retargeting:** Re-engagement campaigns

### 2. Multi-Platform Support
- Facebook
- Instagram
- LinkedIn
- TikTok
- (Extensible for more platforms)

### 3. Format Support
- **Square (1:1):** 400x400px - Universal format for feed posts
- **Story (9:16):** 338x600px - Vertical format for Instagram/Facebook Stories
- **Landscape (4:5):** 640x800px - Horizontal format for wide displays

### 4. Variant Management
- A/B testing with multiple variants per ad type
- Performance tracking and optimization
- Auto-selection of best-performing variants

### 5. Brand Consistency
- Automatically applies user's brand colors
- Uses company fonts across all ads
- Integrates company logo and name
- Pulls content from landing page

### 6. Content Automation
- Extracts images from landing page sections
- Auto-generates titles and descriptions based on ad type
- Customizable CTA buttons
- Smart content matching per platform/format

## File Structure

```
src/pages/AdsEdit/
├── index.js                    # Main ads editor page
├── components/
│   ├── AdVariantCard.jsx      # Individual variant card with actions
│   ├── AdPreview.jsx          # Live preview component (all formats)
│   ├── AdLibraryModal.jsx     # Template library browser
│   └── AdEditModal.jsx        # Variant editing modal
└── README.md                  # This file

pages/lp-editor/[id]/
└── ads.js                     # Next.js route handler
```

## Usage

### Navigation Flow
1. User creates/edits landing page
2. User builds application form
3. **User creates ads** (new step)
4. User launches campaign

### Ads Editor Interface

#### Left Sidebar: Ad Types
- Visual icons for each ad type
- Click to switch between types
- Active type highlighted

#### Middle Panel: Variants
- Shows all variants for selected ad type
- Each variant displays:
  - Thumbnail preview
  - Title and description
  - Selection checkbox
  - Action buttons (Replace, Edit, Delete)
- Add new variants via library or AI generation

#### Right Panel: Live Preview
- Real-time preview of selected variant
- Platform selector (Facebook, Instagram, etc.)
- Format toggle (Square, Story, Landscape)
- Pixel-perfect rendering of actual ad appearance

### Key Actions

1. **Select Variant:** Click on variant card to preview
2. **Edit Variant:** Modify title, description, image, CTA
3. **Replace Template:** Choose different template from library
4. **Delete Variant:** Remove unwanted variants
5. **Add Variant:** Create new variant from template library
6. **Approve All:** Bulk approve all variants for campaign launch

## Data Structure

### Ads Data Model
```javascript
{
  ads: {
    job: {
      enabled: true,
      variants: [
        {
          id: "job-variant-1",
          title: "Join Our Team",
          description: "Ideal for mid-level recruiter role...",
          image: "/path/to/image.jpg",
          template: "template-1",
          selected: true,
          approved: false,
          callToAction: "Apply Now"
        },
        // ... more variants
      ]
    },
    "employer-brand": {
      enabled: true,
      variants: [...]
    },
    // ... more ad types
  }
}
```

## Template System

### Template 1 (Available Now)
- Modern, professional design
- Clean layouts
- Corporate-friendly
- Supports all formats and platforms

### Future Templates
- Bold & Dynamic
- Minimalist Elegant
- Creative & Colorful
- Industry-specific templates

## AI Integration

### Current
- Auto-generates ad content from landing page data
- Smart image selection from page sections
- Context-aware titles and descriptions

### Planned
- AI-powered optimization suggestions
- Performance prediction
- Auto A/B test creation
- Copy improvement recommendations

## Platform-Specific Features

### Facebook/Instagram
- Story format with progress bar
- Sponsored label
- Interactive elements (swipe up, etc.)
- Feed post format

### LinkedIn
- Professional tone optimization
- Company page integration
- Job listing format

### TikTok
- Vertical video support
- Creator-style ads
- Trending audio integration

## Best Practices

1. **Create 3-4 variants** per ad type for effective A/B testing
2. **Use high-quality images** from landing page or upload new ones
3. **Keep titles under 50 characters** for better visibility
4. **Match ad content** to landing page messaging
5. **Test different CTAs** to find what resonates
6. **Enable all ad types** for complete funnel coverage

## Performance Metrics (Future)

- Click-through rate (CTR)
- Cost per click (CPC)
- Conversion rate
- Application completion rate
- Full-funnel attribution

## Technical Notes

### Brand Data Integration
```javascript
const brandData = {
  primaryColor: user?.primaryColor || "#5207CD",
  secondaryColor: user?.secondaryColor || "#0C7CE6",
  tertiaryColor: user?.tertiaryColor || "#6B46C1",
  titleFont: user?.titleFont,
  bodyFont: user?.bodyFont,
  companyLogo: user?.companyLogo,
  companyName: user?.companyName
};
```

### Image Extraction
The system automatically extracts images from:
- Hero section background
- About Company images
- Testimonial photos
- Agenda/Benefits section images

### Responsive Preview
All preview formats are responsive and pixel-perfect replicas of actual ad placements.

## Future Enhancements

1. **Video Ad Support:** Create video ads from static content
2. **Carousel Ads:** Multi-image carousel format
3. **Dynamic Creative:** Auto-optimize based on performance
4. **Bulk Operations:** Edit multiple variants simultaneously
5. **Schedule & Budget:** Set ad schedule and budgets directly
6. **Advanced Targeting:** Build audience segments in-app
7. **Performance Dashboard:** Real-time campaign metrics
8. **AI Copywriter:** Generate and test multiple copy variations

## Support & Documentation

For more information:
- See main project documentation
- Check Figma designs for UI/UX reference
- Review conversation transcripts for strategy details
- Contact development team for technical questions




