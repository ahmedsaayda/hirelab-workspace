# Creative Variants Guide

Sizes: Story 1080×1920, Square 1080×1080, 4:5 1080×1350 (mapped as `landscape`).

Components follow the signature: `(props) => ({ variant, brandData, landingPageData })`.

Job Ad
- Story: `ads/JobAd/Story/Variant1.jsx`, `Variant2.jsx`
- Square: `ads/JobAd/Square/Variant1.jsx`, `Variant2.jsx`
- 4:5: `ads/JobAd/Landscape/Variant1.jsx`, `Variant2.jsx`

Employer Brand (single variant)
- Story/Square/4:5: `ads/EmployerBrand/*/Variant1.jsx`

About Company (single variant)
- Story/Square/4:5: `ads/AboutCompany/*/Variant1.jsx`

Testimonial (single variant)
- Story/Square/4:5: `ads/Testimonial/*/Variant1.jsx`

Shared utilities
- `ads/shared/formatConfig.js` – format specs and layout helpers
- `ads/shared/MaskedImage.jsx` – reusable SVG mask image wrapper

Dynamic fields used
- Job Ad: `vacancyTitle, weAreHiring, applyButtonText, salaryMin/Max/Range/Time/Currency, salaryAvailable, salaryText, location, hoursMin, hoursUnit, heroImage`
- Employer/Company/Testimonial: `employerBrandTitle | aboutCompanyTitle | testimonialQuote/Author/Role`, plus `heroImage`/`testimonialAvatar`


