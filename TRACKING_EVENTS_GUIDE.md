# 🎯 TRACKING EVENTS EXPLAINED

## 📊 WHAT EVENTS ARE WE CAPTURING?

### **🔵 META PIXEL EVENTS:**

#### **Primary Event: `CompleteRegistration`**
```javascript
window.fbq('track', 'CompleteRegistration', {
  content_name: 'User Registration',
  content_category: 'Sign Up',
  value: 0,
  currency: 'USD',
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
  registration_method: 'email',
  user_id: '12345'
});
```

**✅ STANDARD EVENT**: `CompleteRegistration` is one of Meta's **official standard events**

**📋 Meta's Standard Events List:**
- `Purchase` - E-commerce purchases
- `AddToCart` - Adding items to cart
- `InitiateCheckout` - Starting checkout process
- **`CompleteRegistration`** ← **We use this one**
- `Lead` - Lead generation
- `ViewContent` - Content views
- `Search` - Search actions
- `AddToWishlist` - Wishlist additions

---

### **🔗 LINKEDIN INSIGHT TAG EVENTS:**

#### **Method 1: Standard Conversion**
```javascript
window.lintrk('track', { conversion_id: 'signup' });
```

#### **Method 2: URL-Based Conversion**
```javascript
window.lintrk('track', { conversion_url: window.location.href });
```

#### **Method 3: Basic Tracking**
```javascript
window.lintrk('track', {});
```

**❓ SEMI-STANDARD**: LinkedIn doesn't have as rigid "standard events" like Meta
- `conversion_id: 'signup'` is a **common pattern**
- **Flexible naming** - you can use custom conversion IDs
- **URL-based tracking** is also standard practice

---

## 🔄 CAN WE CHANGE THE EVENT NAMES?

### **📊 META PIXEL - LIMITED FLEXIBILITY:**

**✅ Can Change:**
- **Custom parameters** (content_name, registration_method, etc.)
- **Custom events** using `trackCustom`
- **Parameter values**

**❌ Cannot Change:**
- **Standard event names** (`CompleteRegistration` is fixed)
- **Core event structure**

**Example Customizations:**
```javascript
// ✅ Custom parameters (we can change these)
window.fbq('track', 'CompleteRegistration', {
  content_name: 'HireLab User Signup',        // ← Customizable
  content_category: 'B2B Registration',       // ← Customizable
  registration_source: 'organic',             // ← Custom parameter
  user_type: 'employer',                      // ← Custom parameter
  plan_tier: 'free'                          // ← Custom parameter
});

// ✅ Custom events (completely flexible)
window.fbq('trackCustom', 'HireLabSignUp', {
  // Any parameters you want
});
```

### **🔗 LINKEDIN - MORE FLEXIBLE:**

**✅ Can Change:**
- **Conversion IDs** (signup, registration, lead, etc.)
- **Custom parameters**
- **Event naming**

**Example Customizations:**
```javascript
// ✅ Different conversion IDs
window.lintrk('track', { conversion_id: 'employer_signup' });
window.lintrk('track', { conversion_id: 'b2b_registration' });
window.lintrk('track', { conversion_id: 'hirelab_conversion' });

// ✅ Custom parameters
window.lintrk('track', { 
  conversion_id: 'signup',
  user_type: 'employer',
  plan: 'premium'
});
```

---

## 🎯 SHOULD WE CHANGE THE NAMING?

### **🤔 CURRENT NAMING ANALYSIS:**

**Meta: `CompleteRegistration`**
- ✅ **Standard event** - optimal for Facebook's algorithm
- ✅ **Good attribution** - Facebook understands this event type
- ✅ **Campaign optimization** - Facebook can optimize for registrations
- ✅ **Reporting** - appears in standard reports

**LinkedIn: `conversion_id: 'signup'`**
- ✅ **Common pattern** - widely used
- ✅ **Clear meaning** - easy to understand
- ✅ **Campaign targeting** - LinkedIn understands signup goals

### **💡 RECOMMENDATIONS:**

#### **Option 1: Keep Current (Recommended)**
```javascript
// Meta - Use standard event
fbq('track', 'CompleteRegistration', {...});

// LinkedIn - Use common pattern
lintrk('track', { conversion_id: 'signup' });
```
**Why:** Best attribution, campaign optimization, and reporting

#### **Option 2: More Specific Naming**
```javascript
// Meta - Still use standard event but customize parameters
fbq('track', 'CompleteRegistration', {
  content_name: 'HireLab Employer Registration',
  content_category: 'B2B Platform Signup',
  user_type: 'employer'
});

// LinkedIn - More specific conversion ID
lintrk('track', { conversion_id: 'hirelab_employer_signup' });
```

#### **Option 3: Custom Events (Advanced)**
```javascript
// Meta - Custom event for additional tracking
fbq('track', 'CompleteRegistration', {...});  // Keep standard
fbq('trackCustom', 'HireLabSignUp', {...});   // Add custom

// LinkedIn - Multiple conversion tracking
lintrk('track', { conversion_id: 'signup' });
lintrk('track', { conversion_id: 'hirelab_registration' });
```

---

## 🔧 HOW TO CHANGE EVENT NAMES:

### **To Change Meta Parameters:**
```javascript
// File: FE/src/services/TrackingService.js
// Line ~146-156
const eventData = {
  content_name: 'YOUR_CUSTOM_NAME',           // ← Change this
  content_category: 'YOUR_CUSTOM_CATEGORY',   // ← Change this
  registration_source: 'hirelab_platform',   // ← Add custom parameters
  // ...
};
```

### **To Change LinkedIn Conversion ID:**
```javascript
// File: FE/src/services/TrackingService.js
// Line ~202
trackWithRetry('standard', 'signup conversion', { 
  conversion_id: 'YOUR_CUSTOM_CONVERSION_ID'  // ← Change this
});
```

---

## 📈 WHAT HAPPENS IN THE PLATFORMS:

### **Meta Events Manager:**
```
Event: CompleteRegistration
Parameters:
- content_name: "User Registration"
- content_category: "Sign Up"  
- value: 0
- currency: "USD"
- [custom parameters]
```

### **LinkedIn Campaign Manager:**
```
Conversion: signup
URL: /auth/register
Count: +1 conversion
[Additional tracking methods as backup]
```

---

## 🎯 MY RECOMMENDATION:

**Keep the current naming because:**

1. ✅ **`CompleteRegistration`** is Meta's official standard event for sign-ups
2. ✅ **`signup`** is LinkedIn's most common conversion ID
3. ✅ **Best attribution** and campaign optimization
4. ✅ **Standard reporting** across both platforms
5. ✅ **Easy to understand** for marketing teams

**If you want more specificity**, add **custom parameters** rather than changing event names:

```javascript
// Enhanced version with custom parameters
fbq('track', 'CompleteRegistration', {
  content_name: 'HireLab Platform Registration',
  content_category: 'B2B SaaS Signup',
  user_type: 'employer',
  registration_source: 'organic',
  platform: 'hirelab'
});
```

**Want me to implement enhanced custom parameters, or keep it simple as is?**

