# Creative Automation V2 - Next Steps

## ✅ Completed:
1. **Fixed Ad Type Icons** - Implemented proper inline SVG icons matching Figma design
2. **Pixel-Perfect Layout** - All spacing, colors, and typography match Figma exactly
3. **Image Extraction** - Updated `extractImagesFromLandingPage()` to use correct field names:
   - `heroImage`
   - `jobDescriptionImage`
   - `aboutTheCompanyImages`
   - `photoImages`
   - `testimonials[].avatar`
   - `recruiters[].recruiterAvatar`
   - `leaderIntroductionAvatar`
   - `evpMissionAvatar`
   - `companyLogo` (fallback)

## 🔄 In Progress:
### Update Content Generation Functions

**File**: `new/FE/src/pages/AdsEdit/index.js`

#### 1. Update `getDefaultTitle()` (Line 268)
Replace static titles with dynamic content from landing page:

```javascript
const getDefaultTitle = (adTypeId, variantIndex, lpData) => {
  const titles = {
    job: [
      lpData?.vacancyTitle || "Join Our Team",
      `We're Hiring: ${lpData?.vacancyTitle || "Great Opportunity"}`,
      `${lpData?.vacancyTitle || "Career Opportunity"} at ${lpData?.companyName || "Us"}`,
    ],
    "employer-brand": [
      lpData?.evpMissionTitle || "Where Talent Thrives",
      `Life at ${lpData?.companyName || "Our Company"}`,
      lpData?.aboutTheCompanyTitle || "Build Your Future",
    ],
    testimonial: [
      lpData?.testimonials?.[0]?.comment?.substring(0, 50) || "Hear From Our Team",
      lpData?.testimonials?.[1]?.comment?.substring(0, 50) || "Real Stories",
      lpData?.testimonials?.[2]?.comment?.substring(0, 50) || "Employee Spotlight",
    ],
    company: [
      lpData?.aboutTheCompanyTitle || "People are Our Strength",
      `About ${lpData?.companyName || "Our Company"}`,
      lpData?.companyFactsTitle || "Our Culture",
    ],
    retargeting: [
      `Still Interested in ${lpData?.vacancyTitle || "This Role"}?`,
      `Don't Miss Out - ${lpData?.vacancyTitle || "Apply Now"}`,
      `Join ${lpData?.companyName || "Our Team"} Today`,
    ],
  };

  return titles[adTypeId]?.[variantIndex] || lpData?.vacancyTitle || "Join Our Team";
};
```

#### 2. Update `getDefaultDescription()` (Line 301)
Replace static descriptions with actual landing page content:

```javascript
const getDefaultDescription = (adTypeId, variantIndex, lpData) => {
  const descriptions = {
    job: [
      lpData?.heroDescription || "Join our team and make an impact.",
      lpData?.jobDescription?.substring(0, 150) || "Professional opportunity with growth potential.",
      `${lpData?.location?.[0] || "Remote"} • ${lpData?.salaryText || "Competitive Salary"}`,
    ],
    "employer-brand": [
      lpData?.aboutTheCompanyDescription?.substring(0, 150) || "Showcasing our values and mission.",
      lpData?.evpMissionDescription?.substring(0, 150) || "Where innovation meets opportunity.",
      lpData?.companyInfo?.substring(0, 150) || "Building careers, not just filling positions.",
    ],
    testimonial: [
      `${lpData?.testimonials?.[0]?.fullname} - ${lpData?.testimonials?.[0]?.role}`,
      `${lpData?.testimonials?.[1]?.fullname} - ${lpData?.testimonials?.[1]?.role}`,
      `${lpData?.testimonials?.[2]?.fullname} - ${lpData?.testimonials?.[2]?.role}`,
    ],
    company: [
      lpData?.aboutTheCompanyText || "Learn about our commitment to excellence.",
      lpData?.companyFactsDescription || "Discover what makes us great.",
      `${lpData?.companyFacts?.[0]?.headingText} • ${lpData?.companyFacts?.[1]?.headingText}`,
    ],
    retargeting: [
      "Complete your application today and join our team!",
      `${lpData?.location?.[0] || "Remote"} opportunity - limited positions available.`,
      lpData?.footerDescription || "Take the next step in your career.",
    ],
  };

  return descriptions[adTypeId]?.[variantIndex] || lpData?.heroDescription || "Join our team";
};
```

## 📋 Remaining TODOs:

### 3. Implement AdEditModal (`new/FE/src/pages/AdsEdit/components/AdEditModal.jsx`)
**Purpose**: Allow users to edit ad variant details

**Features needed**:
- Edit ad title (text input)
- Edit ad description (textarea)
- Edit CTA text (text input)
- Replace image (image picker from landing page images + upload new)
- Preview changes live
- Save/Cancel buttons

**UI Structure**:
```jsx
<Modal width={800} open={open} onCancel={onClose}>
  <Form>
    <Form.Item label="Ad Title">
      <Input value={title} onChange={...} />
    </Form.Item>
    <Form.Item label="Description">
      <TextArea rows={3} value={description} onChange={...} />
    </Form.Item>
    <Form.Item label="CTA Button Text">
      <Input value={ctaText} onChange={...} />
    </Form.Item>
    <Form.Item label="Image">
      <ImageSelector images={availableImages} selected={image} onChange={...} />
    </Form.Item>
    <div className="preview">
      <AdPreview variant={previewData} format={format} />
    </div>
  </Form>
</Modal>
```

### 4. Implement AdLibraryModal (`new/FE/src/pages/AdsEdit/components/AdLibraryModal.jsx`)
**Purpose**: Allow users to select ad templates

**Features needed**:
- Grid of template thumbnails
- Template categories (Job Ad, Employer Brand, etc.)
- Preview on hover
- Select and apply template
- Generate new variant from selected template

**UI Structure**:
```jsx
<Modal width={1200} open={open} onCancel={onClose}>
  <Tabs>
    <TabPane tab="Job Ads" key="job">
      <div className="grid grid-cols-3 gap-4">
        {templates.map(template => (
          <TemplateCard 
            template={template} 
            onClick={() => onSelect(template)}
          />
        ))}
      </div>
    </TabPane>
    {/* More tabs for other ad types */}
  </Tabs>
</Modal>
```

### 5. Implement Save/Load Ads Data
**Update**: `new/FE/src/pages/AdsEdit/index.js`

Add save function:
```javascript
const saveAdsData = async () => {
  try {
    await CrudService.update("LandingPageData", lpId, {
      adsData: adsData,
    });
    message.success("Ads saved successfully");
  } catch (error) {
    console.error("Error saving ads:", error);
    message.error("Failed to save ads");
  }
};

// Auto-save on changes
useEffect(() => {
  if (adsData && landingPageData) {
    const timer = setTimeout(() => {
      saveAdsData();
    }, 2000); // Debounce 2 seconds
    
    return () => clearTimeout(timer);
  }
}, [adsData]);
```

### 6. Handle Approve All
Implement the approve function to mark all selected variants as approved:

```javascript
const handleApproveAll = () => {
  const updatedAdsData = { ...adsData };
  
  Object.keys(updatedAdsData).forEach((adType) => {
    updatedAdsData[adType].variants = updatedAdsData[adType].variants.map((v) => ({
      ...v,
      approved: v.selected ? true : v.approved,
    }));
  });
  
  setAdsData(updatedAdsData);
  saveAdsData();
  message.success("All selected variants approved!");
};
```

## 🎨 Pixel-Perfect Design Checklist:
- ✅ Header with exact colors and spacing
- ✅ Ad Type sidebar icons (inline SVGs)
- ✅ Variants card layout (70x70 thumbnails, connected buttons)
- ✅ Live preview (338x718 Story format)
- ✅ All colors from Figma (#eceef5, #eaecf0, #d0d5dd, #0e87fe, etc.)
- ✅ Typography (20px headings, 14px/16px body)
- ✅ Spacing (32px padding, 16px gaps)

## 🧪 Testing Requirements:
1. Load a vacancy with full data (like the JSON example)
2. Verify all images are extracted correctly
3. Verify all text content is used in variants
4. Test editing a variant
5. Test replacing a variant with new template
6. Test approving variants
7. Verify data persists after save
8. Test with vacancies that have missing data (graceful fallbacks)

## 📝 Next Immediate Steps:
1. Update `getDefaultTitle()` and `getDefaultDescription()` functions
2. Implement `AdEditModal` with form fields
3. Implement `AdLibraryModal` with template selection
4. Add auto-save functionality
5. Test with real vacancy data




