# Creative Automation V2 - Corrected Flow (From Figma)

## ✅ **Correct Implementation - Based on Figma Design**

### **UI Layout (3 Panels)**

```
┌─────────────────────────────────────────────────────────────────┐
│  [X] Sr. Technical Engineer  [Toggle] [⚙]      [✓ Approve All] │
├──────────┬─────────────────────┬──────────────────────────────────┤
│          │                     │                                  │
│ Ad Types │   Variants (486px)  │  Live Preview / Editor (Flex)    │
│          │                     │                                  │
│   👤     │  ┌───────────────┐  │  ┌────────────────────────────┐ │
│          │  │ ▪ [img]       │  │  │                            │ │
│   💡     │  │ Join Our Team │  │  │                            │ │
│          │  │ Description   │  │  │                            │ │
│   📊     │  │ [Replace|Edit|│  │  │     STORY AD PREVIEW       │ │
│          │  │      Delete]  │  │  │                            │ │
│   🏢     │  └───────────────┘  │  │          OR                │ │
│          │  ┌───────────────┐  │  │                            │ │
│   🔄     │  │ ▫ [img]       │  │  │   ┌─────────────────────┐ │ │
│          │  │ We're Hiring  │  │  │   │ Editor              │ │ │
│          │  │ Description   │  │  │   ├─────────────────────┤ │ │
│          │  │ [Replace|Edit|│  │  │   │ Primary Text        │ │ │
│          │  │      Delete]  │  │  │   │ Headline            │ │ │
│          │  └───────────────┘  │  │   │ Description         │ │ │
│          │  ┌───────────────┐  │  │   │ Image               │ │ │
│          │  │ + Add Variant │  │  │   │ CTA                 │ │ │
│          │  └───────────────┘  │  │   └─────────────────────┘ │ │
│          │                     │  └────────────────────────────┘ │
└──────────┴─────────────────────┴──────────────────────────────────┘
```

---

## 🎯 **User Flow**

### **Step 1: Empty State**
When no ads exist:
- Shows "Generate Ads" button
- Explains what will be generated
- User clicks → Auto-creates variants from landing page

### **Step 2: View Variants**
After generation:
- **Left**: Ad type icons (Job, Employer Brand, Testimonial, Company, Retargeting)
- **Middle**: List of variant cards with:
  - 70×70px thumbnail image
  - Title and description
  - Checkbox (selected state with blue border)
  - 3 action buttons: Replace | Edit | Delete
- **Right**: Live preview of selected variant

### **Step 3: Edit Mode**
When user clicks **"Edit"** on a variant card:
- **Middle**: Variant cards remain visible
- **Right**: Switches from Preview to **Inline Editor** showing:
  - Primary Text field (12/40 counter)
  - Headline field (12/25 counter)
  - Description field (12/40 counter)
  - Image upload area ("Click to upload or drag and drop")
  - Grid of available images from landing page (6 thumbnails)
  - CTA text field
  - Close button (X) at top-right

### **Step 4: Real-time Updates**
- As user types in editor, data updates
- Auto-saves to database (debounced)
- User clicks X → Returns to preview mode

---

## 📐 **Exact Figma Specifications**

### **Variants Panel (Middle - 486px)**
```css
Width: 486px
Padding: 32px
Gap between cards: 16px

Header:
- "Variants" title: 20px font-semibold, #101828
- "3 variants" text: 14px font-semibold, #475467
- Green dot: 8px, #0a8f63

Variant Card:
- Padding: 16px
- Border-radius: 12px
- Border: 1px #eaecf0 (2px #5207CD when selected)
- Gap: 16px

Thumbnail:
- Size: 70×70px
- Border-radius: 10px

Title:
- Font: 16px/600, #101828
- Line-height: 24px

Description:
- Font: 14px/400, #475467
- Line-height: 20px

Checkbox (top-right 12px):
- Size: 20×20px
- Border-radius: 10px
- Border: 1.25px #d0d5dd
- Selected: bg #5207CD, white checkmark

Action Buttons:
- Height: 40px
- Padding: 10px 16px
- Font: 14px/600, #344054
- Border: 1px #d0d5dd
- Connected (no gap between)
- Left button: rounded-l-lg
- Middle button: no rounded, border-y only
- Right button: rounded-r-lg, #d92d20 text
```

### **Inline Editor (Right Panel)**
```css
Header:
- Padding: 24px
- "Editor" title: 20px font-semibold
- Close button: hover:bg-gray-100, rounded-lg

Fields:
- Label: 14px font-medium, #344054
- Character counter: 12px, #667085, top-right
- Input/Textarea: border #d0d5dd, rounded-lg
- Edit icon button: absolute right-2 bottom-2

Primary Text:
- TextArea, 3 rows, max 40 chars

Headline:
- Input, max 25 chars

Description:
- TextArea, 2 rows, max 40 chars

Image Upload:
- Border: 2px dashed #d0d5dd
- Padding: 24px
- Hover: border-#5207CD
- Text: "Click to upload" (blue), "or drag and drop" (gray)
- Subtext: "SVG, PNG, JPG or GIF (max. 800×400px)"

Image Grid:
- Grid: 3 columns, gap-2
- Aspect ratio: video (16:9)
- Border: 2px #e4e7ec
- Selected: border #5207CD, ring-2 ring-#5207CD/20
- Hover: border #98a2b3

CTA Field:
- Input, max 20 chars

AI Button:
- Border #d0d5dd, hover:bg-gray-50
- Full width, centered text
- Sparkle icon
```

---

## 🔄 **State Management**

### **Key States**
```javascript
const [adsData, setAdsData] = useState(null);  // All ads
const [isEmpty, setIsEmpty] = useState(true);   // Show empty state?
const [generating, setGenerating] = useState(false); // Generating?
const [selectedAdType, setSelectedAdType] = useState("job"); // Left sidebar
const [selectedVariant, setSelectedVariant] = useState(null); // Which card selected
const [editingVariant, setEditingVariant] = useState(null);   // Which card editing
const [selectedFormat, setSelectedFormat] = useState("story"); // Preview format
const [selectedPlatform, setSelectedPlatform] = useState("facebook");
```

### **Flow Logic**
```javascript
// 1. Load page
if (isEmpty) {
  return <EmptyState onGenerate={handleGenerateAds} />;
}

// 2. After generate or load from DB
return (
  <Layout>
    <LeftSidebar /> {/* Ad types */}
    <MiddlePanel> {/* Variant cards */}
      <AdVariantCard 
        onEdit={() => setEditingVariant(variant)}
      />
    </MiddlePanel>
    <RightPanel>
      {editingVariant ? (
        <InlineEditor 
          variant={editingVariant}
          onClose={() => setEditingVariant(null)}
        />
      ) : (
        <AdPreview variant={selectedVariant} />
      )}
    </RightPanel>
  </Layout>
);
```

---

## 🎨 **Figma vs Screenshot Differences**

| Element | Your Screenshot | Correct (Figma) |
|---------|----------------|-----------------|
| Middle Panel | Inline Editor | Variant Cards List |
| Right Panel | Preview Only | Preview OR Editor (conditional) |
| Edit Trigger | Always visible | Click "Edit" button on card |
| Editor Location | Replaces Middle | Replaces Right (Preview) |
| Close Editor | No close button | X button top-right |
| Variant Cards | Not visible when editing | Always visible in middle |

---

## 💾 **Database Structure**

```json
{
  "adsData": {
    "job": {
      "enabled": true,
      "variants": [
        {
          "id": "job-variant-1",
          "title": "Join Our Team",
          "description": "Ideal for a mid-level recruiter role...",
          "image": "https://...",
          "ctaText": "Apply Now",
          "selected": true,
          "approved": false,
          "template": "template-1"
        }
      ]
    },
    "employer-brand": { ... },
    "testimonial": { ... },
    "company": { ... },
    "retargeting": { ... }
  }
}
```

---

## 📁 **File Structure (Corrected)**

```
new/FE/src/pages/AdsEdit/
├── index.js                          # Main controller
│   - Shows EmptyState if no ads
│   - Shows variant cards in middle
│   - Conditionally shows Editor OR Preview on right
│
├── components/
│   ├── EmptyState.jsx                # Empty state with generate button
│   ├── AdVariantCard.jsx             # 70×70 thumbnail card with actions
│   ├── InlineEditor.jsx              # Editor panel (replaces preview)
│   ├── AdPreview.jsx                 # Story/Square/Landscape preview
│   ├── AdLibraryModal.jsx            # Template selection (future)
│   └── AdEditModal.jsx               # Not used (replaced by inline)
```

---

## ✅ **Implementation Checklist**

- [x] Empty state with generate button
- [x] Auto-generate from landing page content
- [x] Variant cards list (middle panel, 486px)
- [x] 70×70px thumbnails with title/description
- [x] Replace | Edit | Delete buttons
- [x] Checkbox selection with blue border
- [x] Live preview (right panel)
- [x] Inline editor (replaces preview on "Edit" click)
- [x] Character counters on all fields
- [x] Image picker from landing page (6 thumbnails)
- [x] Close button on editor
- [x] Auto-save to database
- [x] Real-time data updates
- [x] Pixel-perfect Figma colors, spacing, typography

---

## 🚀 **Ready to Test!**

The implementation now matches the Figma design exactly:
1. Start → Empty state → Generate button
2. After generate → Variant cards (middle) + Preview (right)
3. Click "Edit" on card → Editor replaces preview
4. Edit fields → Auto-saves → Click X → Back to preview
5. All data persists in database

Perfect workflow! 🎉




