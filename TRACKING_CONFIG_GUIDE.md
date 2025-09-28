# 🎯 TRACKING CONFIGURATION GUIDE

## 🔧 HOW TO CONTROL META & LINKEDIN IDS/TAGS

### **📋 CURRENT SETUP (After Updates):**

The system now supports **environment variables** with fallback defaults:

**Frontend:**
- `NEXT_PUBLIC_META_PIXEL_ID` → Meta Pixel ID
- `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` → LinkedIn Partner ID

**Backend:**
- `META_PIXEL_ID` → Meta Pixel ID (for server-side)
- `META_ACCESS_TOKEN` → Meta Conversion API Token

---

## **🎛️ CONFIGURATION OPTIONS:**

### **OPTION 1: Environment Variables (.env files)**

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_META_PIXEL_ID=244408738381890
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=6744898
```

**Backend (.env):**
```bash
META_PIXEL_ID=244408738381890
META_ACCESS_TOKEN=EAAUfdNuHXC4BPR1BA9FBwo22obwXEsONvk8JjmJMtZAVpgSi9K1aIlLT0CsXFCVZAw0DGhxhw2zQ0BjiZBzpNxPZAqvfca0gURTglznfFkbev1mMjWyTmYlDxiJlwUyhqVPrizKAOdNoPZAHMAKlSE47lCpMJRgGwiudPzQbXag5pgr58fqM2MbkRw2SpEUAY7QZDZD
```

### **OPTION 2: Direct Code Changes**

**File: `FE/src/services/TrackingService.js` (Lines 2-3)**
```javascript
static META_PIXEL_ID = 'YOUR_NEW_PIXEL_ID';
static LINKEDIN_PARTNER_ID = 'YOUR_NEW_PARTNER_ID';
```

**File: `BE/utils/conversionTracking.js` (Lines 5-6)**
```javascript
static META_PIXEL_ID = 'YOUR_NEW_PIXEL_ID';
static META_ACCESS_TOKEN = 'YOUR_NEW_ACCESS_TOKEN';
```

### **OPTION 3: Database/Admin Panel (Future Enhancement)**

Could add admin panel to control these values dynamically:
- Store in database
- Update via admin interface
- Hot-reload without code changes

---

## **🎯 HOW TO CHANGE IDS RIGHT NOW:**

### **🔄 Quick Change (5 minutes):**

1. **Frontend Meta Pixel ID:**
   ```bash
   # Edit: FE/src/services/TrackingService.js
   # Line 2: Change '244408738381890' to your ID
   ```

2. **Frontend LinkedIn Partner ID:**
   ```bash
   # Edit: FE/src/services/TrackingService.js  
   # Line 3: Change '6744898' to your ID
   ```

3. **Backend Meta Pixel ID:**
   ```bash
   # Edit: BE/utils/conversionTracking.js
   # Line 5: Change '244408738381890' to your ID
   ```

4. **Backend Meta Access Token:**
   ```bash
   # Edit: BE/utils/conversionTracking.js
   # Line 6: Change the long token to your new token
   ```

### **🔧 Professional Change (Environment Variables):**

1. **Create Frontend .env.local:**
   ```bash
   cd FE
   echo "NEXT_PUBLIC_META_PIXEL_ID=YOUR_NEW_PIXEL_ID" > .env.local
   echo "NEXT_PUBLIC_LINKEDIN_PARTNER_ID=YOUR_NEW_PARTNER_ID" >> .env.local
   ```

2. **Create Backend .env:**
   ```bash
   cd BE  
   echo "META_PIXEL_ID=YOUR_NEW_PIXEL_ID" > .env
   echo "META_ACCESS_TOKEN=YOUR_NEW_ACCESS_TOKEN" >> .env
   ```

3. **Restart both servers**

---

## **🔍 WHERE TO GET THESE IDS:**

### **📊 Meta Pixel ID:**
1. Go to: https://business.facebook.com/events_manager
2. Select your pixel
3. Copy the Pixel ID (15-16 digits)

### **🔑 Meta Access Token:**
1. Go to: https://developers.facebook.com/tools/explorer
2. Select your app
3. Generate token with `ads_management` permissions
4. Copy the long token string

### **📈 LinkedIn Partner ID:**
1. Go to: https://www.linkedin.com/campaignmanager
2. Click "Insights" → "Conversion tracking"
3. Find your Partner ID (7 digits)

---

## **🧪 TESTING CHANGES:**

After changing IDs:

1. **Open browser dev tools**
2. **Register a test user**
3. **Check console for:**
   ```
   ✅ Meta Pixel: Script loaded dynamically for registration
   ✅ LinkedIn Insight Tag: Script loaded dynamically for registration
   ✅ Meta Pixel: CompleteRegistration event fired
   ✅ LinkedIn Insight Tag: signup conversion fired
   ```

4. **Verify in platforms:**
   - Meta Events Manager (5-10 minutes)
   - LinkedIn Campaign Manager (24-48 hours)

---

## **🎛️ DYNAMIC CONTROL FUTURE ENHANCEMENT:**

Want to control IDs from admin panel? I can add:

```javascript
// Dynamic loading from database/API
const trackingConfig = await fetch('/api/tracking-config');
const { metaPixelId, linkedinPartnerId } = await trackingConfig.json();

// Use dynamic values
TrackingService.META_PIXEL_ID = metaPixelId;
TrackingService.LINKEDIN_PARTNER_ID = linkedinPartnerId;
```

**Would you like me to implement dynamic configuration from database/admin panel?**

