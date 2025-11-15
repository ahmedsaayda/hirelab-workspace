# Creative Automation V2 - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         HIRELAB PLATFORM                              │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │     ATS      │ ──▶│ Landing Page │ ──▶│     Form     │ ──▶      │
│  │  (External)  │    │   Builder    │    │   Builder    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
│                                                                       │
│                      ┌──────────────────┐                           │
│                   ──▶│  Ads Editor (V2) │ ──▶                       │
│                      └──────────────────┘                           │
│                                                                       │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐          │
│  │   Campaign   │ ──▶│  Attribution │ ──▶│     ATS      │          │
│  │    Launch    │    │   Tracking   │    │   Webhook    │          │
│  └──────────────┘    └──────────────┘    └──────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

## 📦 Component Architecture

```
AdsEdit (Main Container)
├── Header (Navigation & Actions)
│   ├── Back Button
│   ├── Vacancy Title + Status
│   ├── Toggle Switch (Enable/Disable)
│   ├── Settings Button
│   └── Approve All Button
│
├── LeftSidebar (Ad Type Selection)
│   ├── Ad Types List
│   │   ├── Job Ad
│   │   ├── Employer Brand
│   │   ├── Testimonial
│   │   ├── About Company
│   │   └── Retargeting
│   └── Active State Indicator
│
├── MiddlePanel (Variant Management)
│   ├── Variants Header
│   │   ├── Title
│   │   └── Variant Count
│   ├── Variant Cards List
│   │   └── AdVariantCard (per variant)
│   │       ├── Thumbnail
│   │       ├── Title & Description
│   │       ├── Selection Checkbox
│   │       └── Action Buttons
│   │           ├── Replace Button
│   │           ├── Edit Button
│   │           └── Delete Button
│   └── Add Variant Button
│
├── RightPanel (Live Preview)
│   ├── Preview Header
│   │   ├── Platform Selector
│   │   └── Format Toggle Buttons
│   ├── Preview Area
│   │   └── AdPreview Component
│   │       ├── Story Format (9:16)
│   │       ├── Square Format (1:1)
│   │       └── Landscape Format (4:5)
│   └── Preview Controls
│
├── AdLibraryModal (Template Selection)
│   ├── Search & Filters
│   │   ├── Search Input
│   │   ├── Platform Filter
│   │   ├── Format Filter
│   │   └── Ad Type Filter
│   ├── Template Grid
│   │   └── Template Cards
│   └── Actions (Cancel, Apply)
│
└── AdEditModal (Variant Editing)
    ├── Title Input
    ├── Description Input
    ├── CTA Selector
    ├── Image Selection
    │   ├── From Landing Page Tab
    │   └── Upload New Tab
    ├── AI Suggestions Section
    └── Actions (Cancel, Save)
```

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER ACTIONS                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     REACT STATE                                  │
│  - selectedAdType                                                │
│  - selectedPlatform                                              │
│  - selectedFormat                                                │
│  - selectedVariant                                               │
│  - adsData (all variants)                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AUTO-GENERATION                                │
│  - Extract images from landing page                              │
│  - Generate titles/descriptions                                  │
│  - Apply brand colors/fonts                                      │
│  - Create 3 variants per type                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PREVIEW RENDER                                │
│  - Format-specific rendering                                     │
│  - Platform-specific styles                                      │
│  - Brand customization                                           │
│  - Real-time updates                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SAVE TO DB                                  │
│  landingPageData.ads = {                                         │
│    job: { enabled, variants: [...] },                           │
│    "employer-brand": { enabled, variants: [...] },              │
│    ...                                                           │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 Ad Funnel Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    STAGE 1: COLD AUDIENCE                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Ad Type: JOB AD (Direct Apply)                           │  │
│  │ Target: Lookalike audiences, Interest-based, ATS CRM    │  │
│  │ Goal: Drive first visits to job page                     │  │
│  │ Variants: "Join Our Team", "We're Hiring", etc.         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Clicked Ad)
┌────────────────────────────────────────────────────────────────┐
│                    STAGE 2: WARM AUDIENCE                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Ad Types: EMPLOYER BRAND + TESTIMONIAL                   │  │
│  │ Target: People who clicked Stage 1 ads                   │  │
│  │ Goal: Build emotional trust & connection                 │  │
│  │ Variants: Culture, mission, employee stories            │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Viewed Stage 2)
┌────────────────────────────────────────────────────────────────┐
│                     STAGE 3: HOT AUDIENCE                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Ad Type: COMPANY BRANDING                                │  │
│  │ Target: People who viewed Stage 2 ads                    │  │
│  │ Goal: Remove hesitation, push to apply                   │  │
│  │ Variants: EVP pitch, benefits, differentiators          │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼ (Started Application)
┌────────────────────────────────────────────────────────────────┐
│                 STAGE 4: CONVERSION PUSH                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Ad Type: JOB AD RETARGETING                              │  │
│  │ Target: Page visitors & form starters (incomplete)       │  │
│  │ Goal: Get fence-sitters to complete application          │  │
│  │ Variants: "Still Interested?", "Last Chance", etc.      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                      APPLICATION COMPLETE
```

## 🎨 Brand System Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER PROFILE                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ - primaryColor: "#5207CD"                                 │  │
│  │ - secondaryColor: "#0C7CE6"                               │  │
│  │ - tertiaryColor: "#6B46C1"                                │  │
│  │ - titleFont: "Inter"                                      │  │
│  │ - bodyFont: "Roboto"                                      │  │
│  │ - subheaderFont: "Inter"                                  │  │
│  │ - companyLogo: "/path/to/logo.png"                        │  │
│  │ - companyName: "HR Pro"                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLIED TO ALL ADS                            │
│                                                                  │
│  Page Builder ──┐                                               │
│  Form Builder ──┼──▶ Consistent Brand Application               │
│  Ads Editor  ───┘                                               │
│                                                                  │
│  ✓ Same colors across all platforms                            │
│  ✓ Same fonts in all formats                                   │
│  ✓ Logo appears consistently                                   │
│  ✓ Company name standardized                                   │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 Format Specifications

```
┌──────────────────────────────────────────────────────────────────┐
│                      STORY FORMAT (9:16)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Dimensions: 338px × 600px                                  │  │
│  │ Platforms: Facebook Stories, Instagram Stories             │  │
│  │ Structure:                                                 │  │
│  │   - Progress bar at top                                    │  │
│  │   - Company logo + name (sponsored)                        │  │
│  │   - Main image (300px height)                              │  │
│  │   - Title + Description                                    │  │
│  │   - CTA button at bottom                                   │  │
│  │   - Swipe up indicator                                     │  │
│  │   - More/Close buttons (top right)                         │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                      SQUARE FORMAT (1:1)                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Dimensions: 400px × 400px                                  │  │
│  │ Platforms: Facebook Feed, Instagram Feed                   │  │
│  │ Structure:                                                 │  │
│  │   - Post header (logo + name + "Sponsored")                │  │
│  │   - Main image (300px height)                              │  │
│  │   - Title + Description                                    │  │
│  │   - CTA button (full width)                                │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    LANDSCAPE FORMAT (4:5)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Dimensions: 640px × 360px                                  │  │
│  │ Platforms: LinkedIn, Desktop Feed                          │  │
│  │ Structure:                                                 │  │
│  │   Left Half: Main image                                    │  │
│  │   Right Half:                                              │  │
│  │     - Company logo + name                                  │  │
│  │     - Title + Description                                  │  │
│  │     - CTA button                                           │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## 🔌 Integration Points

```
┌────────────────────────────────────────────────────────────────┐
│                      INTERNAL INTEGRATIONS                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Landing Page Builder                                          │
│  ├── Extract hero background image                            │
│  ├── Pull about company images                                │
│  ├── Get testimonial photos                                   │
│  ├── Extract benefits/agenda images                           │
│  └── Use vacancy title & description                          │
│                                                                │
│  Form Builder                                                  │
│  ├── Reference form URL in ads                                │
│  └── Track form submissions from ads                          │
│                                                                │
│  User Profile / Branding                                       │
│  ├── Primary/secondary/tertiary colors                        │
│  ├── Title/body/subheader fonts                               │
│  ├── Company logo & name                                      │
│  └── Brand guidelines                                         │
│                                                                │
│  Campaign Launch                                               │
│  ├── Pass ad creatives to launch system                       │
│  ├── Set up A/B tests automatically                           │
│  └── Connect to platform APIs                                 │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                     EXTERNAL INTEGRATIONS                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Facebook/Instagram Ads API                                    │
│  ├── Upload ad creatives                                      │
│  ├── Create ad campaigns                                      │
│  ├── Set targeting parameters                                │
│  └── Track performance metrics                               │
│                                                                │
│  LinkedIn Campaign Manager API                                 │
│  ├── Upload sponsored content                                 │
│  ├── Create job ads                                           │
│  └── Track applications                                       │
│                                                                │
│  TikTok Ads Manager API                                        │
│  ├── Upload video/image ads                                   │
│  ├── Target Gen Z audience                                    │
│  └── Track engagement                                         │
│                                                                │
│  ATS Webhooks (Future)                                         │
│  ├── Send applicant data                                      │
│  ├── Track source attribution                                 │
│  └── Update job status                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 💾 Database Schema

```sql
-- Landing Page Data (Updated)
LandingPageData {
  _id: ObjectId,
  vacancyTitle: String,
  heroDescription: String,
  hero: {
    backgroundImage: String,
    ...
  },
  aboutCompany: {
    images: [String],
    ...
  },
  testimonials: [{
    image: String,
    ...
  }],
  
  -- NEW: Ads data
  ads: {
    job: {
      enabled: Boolean,
      variants: [{
        id: String,
        title: String,
        description: String,
        image: String,
        template: String,
        selected: Boolean,
        approved: Boolean,
        callToAction: String
      }]
    },
    "employer-brand": {
      enabled: Boolean,
      variants: [...]
    },
    testimonial: {
      enabled: Boolean,
      variants: [...]
    },
    company: {
      enabled: Boolean,
      variants: [...]
    },
    retargeting: {
      enabled: Boolean,
      variants: [...]
    }
  },
  
  primaryColor: String,
  secondaryColor: String,
  tertiaryColor: String,
  companyLogo: String,
  companyName: String,
  ...
}

-- Ad Templates (New Collection)
AdTemplate {
  _id: ObjectId,
  name: String,
  preview: String,
  platform: Enum[facebook, instagram, linkedin, tiktok],
  format: Enum[square, story, landscape],
  adType: Enum[job, employer-brand, testimonial, company, retargeting],
  tags: [String],
  template: Object, // Template structure
  created: Date,
  updated: Date
}

-- Campaign Performance (Future)
CampaignPerformance {
  _id: ObjectId,
  landingPageId: ObjectId,
  variantId: String,
  platform: String,
  impressions: Number,
  clicks: Number,
  ctr: Number,
  cpc: Number,
  applications: Number,
  conversionRate: Number,
  date: Date
}
```

## 🚀 Performance Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    OPTIMIZATION STRATEGIES                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  React Optimizations                                           │
│  ├── useMemo for expensive calculations                       │
│  ├── useCallback for stable function references               │
│  ├── Lazy loading of modals                                   │
│  └── Efficient re-render prevention                           │
│                                                                │
│  Image Optimizations                                           │
│  ├── Lazy loading of images                                   │
│  ├── Thumbnail generation for variants                        │
│  ├── CDN delivery                                             │
│  └── Format optimization (WebP)                               │
│                                                                │
│  Code Splitting                                                │
│  ├── Route-based splitting                                    │
│  ├── Component-based splitting                                │
│  └── Modal lazy loading                                       │
│                                                                │
│  Caching Strategy                                              │
│  ├── Landing page data cache                                  │
│  ├── Template library cache                                   │
│  ├── User brand data cache                                    │
│  └── Preview render cache                                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 🔒 Security Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      SECURITY LAYERS                            │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Authentication                                                │
│  ├── User must be logged in                                   │
│  ├── JWT token validation                                     │
│  └── Session management                                       │
│                                                                │
│  Authorization                                                 │
│  ├── User must own landing page                               │
│  ├── Workspace isolation                                      │
│  └── Role-based access control                                │
│                                                                │
│  Data Validation                                               │
│  ├── Server-side validation                                   │
│  ├── XSS prevention                                           │
│  ├── SQL injection prevention                                 │
│  └── File upload sanitization                                 │
│                                                                │
│  Rate Limiting                                                 │
│  ├── API endpoint rate limits                                 │
│  ├── Image upload limits                                      │
│  └── Abuse prevention                                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

## 📊 Analytics & Tracking

```
┌────────────────────────────────────────────────────────────────┐
│                    TRACKING EVENTS (Future)                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Ad Creation Events                                            │
│  ├── ad_variant_created                                       │
│  ├── ad_variant_edited                                        │
│  ├── ad_variant_deleted                                       │
│  ├── ad_template_selected                                     │
│  └── ad_type_enabled                                          │
│                                                                │
│  Ad Performance Events                                         │
│  ├── ad_impression (via platform API)                         │
│  ├── ad_click (via tracking pixel)                            │
│  ├── landing_page_visit (via Meta Pixel)                      │
│  ├── form_start (via tracking)                                │
│  └── application_complete (via webhook)                       │
│                                                                │
│  Campaign Events                                               │
│  ├── campaign_launched                                        │
│  ├── campaign_paused                                          │
│  ├── budget_depleted                                          │
│  └── performance_alert                                        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

This architecture document provides a comprehensive overview of how the Creative Automation V2 system is structured and integrated into the HireLab platform.




