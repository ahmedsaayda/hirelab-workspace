# Creative Automation V2 - Quick Start Guide

## 🚀 Getting Started

### For Frontend Developers

#### 1. Test the Ads Editor
```bash
# Start the development server
cd new/FE
npm run dev

# Navigate to:
http://localhost:3000/lp-editor/[LANDING_PAGE_ID]/ads
```

#### 2. Test Flow
```
1. Go to Dashboard → Vacancies
2. Click "Edit" on any vacancy
3. Click "Page" tab (create/edit landing page)
4. Click "Form" tab (create/edit form)
5. Click "Ads" tab (NEW - ads editor)
```

#### 3. Key Files to Know
```
src/pages/AdsEdit/
├── index.js              # Main editor (start here)
├── components/
│   ├── AdVariantCard.jsx # Variant display
│   ├── AdPreview.jsx     # Live preview
│   ├── AdLibraryModal.jsx # Template picker
│   └── AdEditModal.jsx   # Edit modal
```

---

### For Backend Developers

#### 1. Database Updates Needed
```javascript
// Add to LandingPageData schema
{
  ads: {
    job: {
      enabled: Boolean,
      variants: [VariantSchema]
    },
    "employer-brand": {
      enabled: Boolean,
      variants: [VariantSchema]
    },
    testimonial: {
      enabled: Boolean,
      variants: [VariantSchema]
    },
    company: {
      enabled: Boolean,
      variants: [VariantSchema]
    },
    retargeting: {
      enabled: Boolean,
      variants: [VariantSchema]
    }
  }
}

// Variant Schema
{
  id: String,
  title: String,
  description: String,
  image: String,
  template: String,
  selected: Boolean,
  approved: Boolean,
  callToAction: String
}
```

#### 2. API Endpoints to Create
```javascript
// EXISTING (just update to save ads field)
PUT /api/landing-pages/:id
{
  ...landingPageData,
  ads: { ... }
}

// NEW ENDPOINTS
GET /api/ad-templates
// Returns: Array of template objects

POST /api/ad-templates
// Body: Template object
// Returns: Created template

GET /api/ads/performance/:landingPageId
// Returns: Performance metrics (future)
```

#### 3. Quick Backend Test
```javascript
// Test saving ads data
const testAdsData = {
  job: {
    enabled: true,
    variants: [
      {
        id: "job-variant-1",
        title: "Join Our Team",
        description: "Great opportunity",
        image: "/path/to/image.jpg",
        template: "template-1",
        selected: true,
        approved: false,
        callToAction: "Apply Now"
      }
    ]
  }
};

// Save via existing update endpoint
await LandingPageData.findByIdAndUpdate(
  landingPageId,
  { $set: { ads: testAdsData } }
);
```

---

### For Designers

#### 1. Template Creation Workflow
```
1. Design ad template in Figma
2. Export assets (SVG for shapes, PNG for images)
3. Note measurements and spacing
4. Document brand color variables
5. Add to template library
```

#### 2. Template Requirements
- **Vertical (9:16):** 338px × 600px minimum
- **Square (1:1):** 400px × 400px minimum  
- **Landscape (4:5):** 640px × 800px minimum
- All text must support dynamic content
- Colors must use CSS variables for branding

#### 3. Design Checklist
- [ ] Works with user's brand colors
- [ ] Text is readable in all color schemes
- [ ] Logo placement is flexible
- [ ] CTA button is prominent
- [ ] Mobile-friendly (for story format)
- [ ] Meets platform guidelines

---

## 🧪 Testing Guide

### Manual Test Checklist

```
[ ] Can navigate to Ads editor
[ ] Ad types switch correctly
[ ] Variants display with images
[ ] Can select/deselect variants
[ ] Edit modal opens and saves
[ ] Library modal shows templates
[ ] Preview updates in real-time
[ ] Platform selector works
[ ] Format toggle works
[ ] Brand colors apply correctly
[ ] Company logo appears
[ ] Delete confirmation works
[ ] Add variant button works
[ ] Approve all button works
[ ] Navigation to other tabs works
[ ] Data persists on page reload
```

### Automated Tests (To Add)
```javascript
// Example test structure
describe('Ads Editor', () => {
  it('loads ads data from landing page', async () => {
    // Test implementation
  });
  
  it('generates variants automatically', async () => {
    // Test implementation
  });
  
  it('applies brand colors correctly', async () => {
    // Test implementation
  });
  
  it('saves changes to database', async () => {
    // Test implementation
  });
});
```

---

## 🎨 Customization Guide

### Adding a New Ad Type
```javascript
// 1. Add to AD_TYPES array in index.js
{
  id: "new-type",
  label: "New Type",
  icon: "/icons/new-icon.svg",
  description: "Description here",
}

// 2. Add default titles in getDefaultTitle()
const titles = {
  "new-type": [
    "Title Variant 1",
    "Title Variant 2",
    "Title Variant 3",
  ],
};

// 3. Add default descriptions in getDefaultDescription()
const descriptions = {
  "new-type": [
    "Description 1",
    "Description 2",
    "Description 3",
  ],
};
```

### Adding a New Platform
```javascript
// 1. Add to PLATFORMS array
{
  id: "new-platform",
  label: "New Platform",
  icon: "/icons/new-platform.svg"
}

// 2. Update AdPreview.jsx to support new platform
// Add platform-specific rendering logic
```

### Adding a New Format
```javascript
// 1. Add to AD_FORMATS array
{
  id: "new-format",
  label: "New Format (X:Y)",
  aspectRatio: "X:Y",
  width: XXX,
  height: YYY
}

// 2. Add rendering logic in AdPreview.jsx
if (format.id === "new-format") {
  return (
    // JSX for new format
  );
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
```javascript
// Check 1: Verify image URLs
console.log('Image URL:', variant.image);

// Check 2: Verify CORS settings
// Check 3: Check network tab in browser

// Fix: Ensure images are accessible
```

#### Preview Not Updating
```javascript
// Check 1: Verify state updates
console.log('Current variant:', variantForPreview);

// Check 2: Check useEffect dependencies
// Check 3: Force re-render with key prop

// Fix: Add forceUpdate or check memoization
```

#### Brand Colors Not Applying
```javascript
// Check 1: Verify user profile has colors
console.log('User colors:', user);

// Check 2: Check brandData prop
console.log('Brand data:', userBrandData);

// Fix: Ensure user profile is loaded
```

#### Variants Not Saving
```javascript
// Check 1: Verify API endpoint
console.log('Saving to:', `/api/landing-pages/${lpId}`);

// Check 2: Check request payload
console.log('Payload:', adsData);

// Check 3: Check server logs

// Fix: Ensure backend accepts ads field
```

---

## 📚 Code Examples

### Example 1: Add Custom Variant
```javascript
const addCustomVariant = () => {
  const newVariant = {
    id: `custom-${Date.now()}`,
    title: "Custom Title",
    description: "Custom description",
    image: "/path/to/custom-image.jpg",
    template: "template-1",
    selected: false,
    approved: false,
    callToAction: "Custom CTA"
  };

  const updatedVariants = [...currentVariants, newVariant];
  
  setAdsData({
    ...adsData,
    [selectedAdType]: {
      ...adsData[selectedAdType],
      variants: updatedVariants,
    },
  });
};
```

### Example 2: Bulk Edit Variants
```javascript
const bulkEditVariants = (updates) => {
  const updatedVariants = currentVariants.map(variant => ({
    ...variant,
    ...updates,
  }));

  setAdsData({
    ...adsData,
    [selectedAdType]: {
      ...adsData[selectedAdType],
      variants: updatedVariants,
    },
  });
};

// Usage
bulkEditVariants({ approved: true });
```

### Example 3: Export Ads for Campaign
```javascript
const exportAdsForCampaign = () => {
  const selectedAds = [];
  
  Object.keys(adsData).forEach(adType => {
    if (adsData[adType].enabled) {
      const selectedVariant = adsData[adType].variants.find(
        v => v.selected && v.approved
      );
      if (selectedVariant) {
        selectedAds.push({
          adType,
          ...selectedVariant,
        });
      }
    }
  });

  return selectedAds;
};
```

---

## 🔗 Useful Links

### Documentation
- Main README: `/new/FE/src/pages/AdsEdit/README.md`
- Architecture: `/new/FE/src/pages/AdsEdit/SYSTEM_ARCHITECTURE.md`
- Implementation Summary: `/CREATIVE_AUTOMATION_V2_IMPLEMENTATION.md`

### Figma Design
- Design file: Check Trello card for Figma link
- Node ID: `1:24668` (Ad types > Cold audience frame)

### Similar Tools (Inspiration)
- AdCreative.ai: https://www.adcreative.ai
- Hunch: https://www.hunch.com
- Canva Ads: https://www.canva.com/ads

### Platform Guidelines
- Facebook Ads: https://www.facebook.com/business/ads-guide
- Instagram Ads: https://business.instagram.com/advertising
- LinkedIn Ads: https://business.linkedin.com/marketing-solutions/ad-formats
- TikTok Ads: https://ads.tiktok.com/help

---

## 💡 Tips & Tricks

### Performance
```javascript
// Tip 1: Memoize expensive calculations
const filteredVariants = useMemo(() => {
  return variants.filter(v => v.enabled);
}, [variants]);

// Tip 2: Debounce save operations
const debouncedSave = useCallback(
  debounce(saveAdsData, 1000),
  []
);

// Tip 3: Lazy load images
<img loading="lazy" src={image} alt="" />
```

### User Experience
```javascript
// Tip 1: Show loading states
{isLoading && <Skeleton active />}

// Tip 2: Confirm destructive actions
Modal.confirm({
  title: 'Delete variant?',
  content: 'This cannot be undone',
  onOk: handleDelete
});

// Tip 3: Provide helpful feedback
message.success('Variant saved!');
```

### Debugging
```javascript
// Tip 1: Add console logs strategically
console.log('🎯 Ad type changed:', selectedAdType);
console.log('📊 Current variants:', currentVariants);

// Tip 2: Use React DevTools
// Install: https://react-devtools-tutorial.vercel.app/

// Tip 3: Check network requests
// Use browser DevTools Network tab
```

---

## 🎯 Next Steps

### For Complete Implementation

1. **Backend Setup** (1-2 days)
   - [ ] Add `ads` field to database schema
   - [ ] Update API to handle ads data
   - [ ] Create template library endpoints
   - [ ] Set up image storage

2. **Template Library** (2-3 days)
   - [ ] Design 10-15 templates for each format
   - [ ] Export and optimize assets
   - [ ] Upload to template library
   - [ ] Test with different brand colors

3. **Testing** (1-2 days)
   - [ ] Manual testing all features
   - [ ] Test with real user data
   - [ ] Cross-browser testing
   - [ ] Mobile responsive testing

4. **Integration** (1-2 days)
   - [ ] Connect to campaign launch
   - [ ] Set up tracking pixels
   - [ ] Integrate with platform APIs
   - [ ] Test end-to-end flow

5. **Launch** (1 day)
   - [ ] User training/documentation
   - [ ] Deploy to production
   - [ ] Monitor for issues
   - [ ] Gather user feedback

---

## 📞 Need Help?

### Resources
- **Frontend Issues:** Check React DevTools and browser console
- **Backend Issues:** Check server logs and API responses
- **Design Issues:** Reference Figma design file
- **Feature Questions:** Review README and Architecture docs

### Contact
- Development Team: For technical implementation
- Product Team: For feature clarification
- Design Team: For UI/UX questions

---

**Happy Coding! 🚀**




