# 🎯 WHAT WE EXTRACT FROM YOUR TRACKING CODES

## 📊 FROM YOUR PROVIDED META PIXEL CODE:

### **Original Code:**
```javascript
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '244408738381890');          // ← EXTRACT THIS ID
fbq('track', 'PageView');               // ← IGNORE THIS
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=244408738381890&ev=PageView&noscript=1"
/></noscript>
```

### **What We Extract:**
- ✅ **Meta Pixel ID**: `244408738381890`

### **What We Ignore:**
- ❌ **Script loading function**: We rebuild this dynamically
- ❌ **fbq('track', 'PageView')**: We don't want global page views
- ❌ **Noscript tag**: We rebuild this dynamically

---

## 🔗 FROM YOUR PROVIDED LINKEDIN CODE:

### **Original Code:**
```javascript
<script type="text/javascript">
_linkedin_partner_id = "6744898";       // ← EXTRACT THIS ID
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);
</script>
<script type="text/javascript">
(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);
</script>
<noscript>
<img height="1" width="1" style="display:none;" alt="" src="https://px.ads.linkedin.com/collect/?pid=6744898&fmt=gif" />
</noscript>
```

### **What We Extract:**
- ✅ **LinkedIn Partner ID**: `6744898`

### **What We Ignore:**
- ❌ **Script loading function**: We rebuild this dynamically
- ❌ **Noscript tag**: We rebuild this dynamically

---

## 🔑 FROM YOUR ACCESS TOKEN:

### **Original:**
```
EAAUfdNuHXC4BPR1BA9FBwo22obwXEsONvk8JjmJMtZAVpgSi9K1aIlLT0CsXFCVZAw0DGhxhw2zQ0BjiZBzpNxPZAqvfca0gURTglznfFkbev1mMjWyTmYlDxiJlwUyhqVPrizKAOdNoPZAHMAKlSE47lCpMJRgGwiudPzQbXag5pgr58fqM2MbkRw2SpEUAY7QZDZD
```

### **What We Use:**
- ✅ **Meta Access Token**: For server-side Conversion API (optional backend feature)

---

## ⚙️ WHAT CHANGES WHEN ACCOUNT CHANGES:

### **🔄 If You Change Meta Account:**

**New Meta pixel code will look like:**
```javascript
fbq('init', 'NEW_PIXEL_ID_HERE');  // ← Different number
```

**What you need to update:**
1. **Frontend**: `FE/src/services/TrackingService.js` → Line 2
   ```javascript
   static META_PIXEL_ID = 'NEW_PIXEL_ID_HERE';
   ```

2. **Backend**: `BE/utils/conversionTracking.js` → Line 5
   ```javascript
   static META_PIXEL_ID = 'NEW_PIXEL_ID_HERE';
   ```

3. **New Access Token**: Get new token from new account
   ```javascript
   static META_ACCESS_TOKEN = 'NEW_ACCESS_TOKEN_HERE';
   ```

### **🔄 If You Change LinkedIn Account:**

**New LinkedIn code will look like:**
```javascript
_linkedin_partner_id = "NEW_PARTNER_ID";  // ← Different number
```

**What you need to update:**
1. **Frontend**: `FE/src/services/TrackingService.js` → Line 3
   ```javascript
   static LINKEDIN_PARTNER_ID = 'NEW_PARTNER_ID';
   ```

---

## 🎯 SUMMARY - ONLY 3 VALUES MATTER:

From ALL that code, we only need these **3 values**:

| **Platform** | **Value Type** | **Example Value** | **Where to Update** |
|-------------|---------------|------------------|-------------------|
| Meta | Pixel ID | `244408738381890` | Frontend + Backend |
| Meta | Access Token | `EAAUfdNu...` | Backend only |
| LinkedIn | Partner ID | `6744898` | Frontend only |

**Everything else** (script loading, noscript tags, etc.) is **automatically handled** by our dynamic loading system.

---

## 🔧 ENVIRONMENT VARIABLE SETUP:

Instead of changing code files, use environment variables:

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_META_PIXEL_ID=244408738381890
NEXT_PUBLIC_LINKEDIN_TRACKING_ID=6744898
```

**Backend (.env):**
```bash
META_PIXEL_ID=244408738381890
META_ACCESS_TOKEN=EAAUfdNuHXC4BPR1BA9FBwo22obwXEsONvk8JjmJMtZAVpgSi9K1aIlLT0CsXFCVZAw0DGhxhw2zQ0BjiZBzpNxPZAqvfca0gURTglznfFkbev1mMjWyTmYlDxiJlwUyhqVPrizKAOdNoPZAHMAKlSE47lCpMJRgGwiudPzQbXag5pgr58fqM2MbkRw2SpEUAY7QZDZD
```

**Then restart both servers and it will use your new values!**

