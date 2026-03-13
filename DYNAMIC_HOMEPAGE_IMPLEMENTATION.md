# 🎯 Dynamic Homepage Implementation Guide

## Overview
Transformed the homepage from static hardcoded content to a fully dynamic, admin-manageable system with enterprise-grade features.

---

## ✅ Backend Implementation (COMPLETED)

### 1. Database Models Created
**Location**: `backend/core/models.py`

Five new models for homepage content management:

#### `WellnessTip`
- Daily rotating wellness advice
- Scheduling (display_from, display_until)
- Country targeting
- View analytics
- **Admin manageable**: Create multiple tips, system rotates daily

#### `WellnessArticle`
- Featured insights/articles for "Wellness Insights" section
- Categories: Self-Care, Research, Mindfulness, Therapy, etc.
- Image upload support
- External URL linking
- Display order control
- Click/view analytics
- **Admin manageable**: Mark as featured, set display order

#### `CrisisHelpline`
- Country-specific emergency helplines
- Replaces hardcoded "Kenya Red Cross 1199"
- Multi-language support
- 24/7 availability flags
- Primary helpline designation per country
- **Admin manageable**: Add helplines for any country

#### `FeaturedBanner`
- Hero section rotating banners
- Image upload with title/subtitle overlay
- Optional call-to-action button
- Scheduling (display_from, display_until)
- View/click analytics
- **Admin manageable**: Upload images, schedule promotions

#### `UserNotification`
- Real notification system for notification bell
- Types: INFO, SUCCESS, WARNING, REMINDER, APPOINTMENT
- Read/unread status
- Action URLs for navigation
- **Admin manageable**: Send notifications to specific users

---

### 2. Django Admin Interfaces
**Location**: `backend/core/admin.py`

Professional admin panels with:
- ✅ List displays with key info
- ✅ Inline editing (display_order, is_active, is_featured)
- ✅ Search and filters
- ✅ Image previews
- ✅ Bulk actions (mark notifications as read)
- ✅ Collapsible analytics sections
- ✅ Auto-set created_by field

**Access**: `http://localhost:8000/admin/`
- WellnessTips
- WellnessArticles  
- CrisisHelplines
- FeaturedBanners
- UserNotifications

---

### 3. GraphQL API
**Location**: `backend/core/schema.py`

New GraphQL queries:
```graphql
{
  # Daily wellness tip (auto-filtered by country, date)
  wellnessTipOfDay {
    id
    title
    content
    icon
    category
  }
  
  # Featured articles for homepage
  featuredWellnessArticles {
    id
    title
    subtitle
    category
    icon
    imageUrl
    externalUrl
  }
  
  # Crisis helpline (auto-selected by user's country)
  crisisHelpline {
    id
    name
    phoneNumber
    description
    is247
    countryName
  }
  
  # Hero banners (active, scheduled)
  featuredBanners {
    id
    title
    subtitle
    imageUrl
    actionText
    actionUrl
  }
  
  # User's notifications
  myNotifications {
    id
    title
    message
    isRead
    createdAt
  }
  
  # Unread notification count (for badge)
  unreadNotificationCount
}
```

**Features**:
- ✅ Automatic country filtering (uses user's country)
- ✅ Date/time scheduling (only shows active content)
- ✅ Analytics tracking (auto-increments view counts)
- ✅ Smart helpline fallback (user country → provided country → default)

---

### 4. Seed Data Command
**Location**: `backend/core/management/commands/seed_homepage_content.py`

**Usage**:
```bash
cd backend
source venv/bin/activate
python manage.py seed_homepage_content
```

**Creates**:
- 5 wellness tips (breathing, gratitude, digital detox, nature walks, connection)
- 3 featured articles (self-care, research, mindfulness)
- 1 crisis helpline (Kenya Red Cross)
- 1 featured banner (calmer moment)

---

## ✅ Frontend Implementation (COMPLETED)

### 1. GraphQL Query
**Location**: `frontend/src/graphql/queries/homepageContent.graphql`

Single query fetches ALL homepage data in one network call.

### 2. Custom React Hook
**Location**: `frontend/src/hooks/useHomepageContent.ts`

```typescript
const {
  wellnessTip,      // Today's tip
  articles,         // Featured articles array
  helpline,         // Crisis helpline object
  banners,          // Hero banners array
  notifications,    // User notifications array
  unreadCount,      // Badge count
  loading,          // Loading state
  error,            // Error state
  refetch,          // Refresh function
} = useHomepageContent();
```

**Features**:
- Cache-and-network policy (fast + fresh data)
- TypeScript typed
- Easy to use in components

---

## 🔄 Next Steps to Complete

### Step 1: Seed Initial Data
```bash
cd backend
source venv/bin/activate
python manage.py seed_homepage_content
```

### Step 2: Upload Images (Django Admin)
1. Go to `http://localhost:8000/admin/`
2. Navigate to **Featured Banners**
3. Click on "A calmer moment, right now"
4. Upload the hero image (`image-1.jpg` from assets)
5. Save

6. Navigate to **Wellness Articles**
7. Add images to articles:
   - "Self-Care Matters" → `image-2.png`
   - "Evidence-Based Support" → `image-3.jpg`
8. Save each

### Step 3: Update Homepage Component
**File**: `frontend/app/(tabs)/index.tsx`

Replace hardcoded sections with:
```typescript
import { useHomepageContent } from '@/hooks/useHomepageContent';

export default function HomePage() {
  const { 
    wellnessTip, 
    articles, 
    helpline, 
    banners,
    unreadCount,
    loading 
  } = useHomepageContent();
  
  // Use dynamic data instead of hardcoded values
}
```

**Changes needed**:
1. Daily Wellness Tip → Use `wellnessTip`
2. Wellness Insights cards → Map over `articles`
3. Hero banner → Use `banners[0]` (or carousel for multiple)
4. Emergency helpline → Use `helpline`
5. Notification badge → Show `unreadCount`
6. Add loading skeleton while `loading === true`

### Step 4: Test
1. Restart backend: `python manage.py runserver`
2. Reload mobile app: Press `r` in Expo
3. Check homepage loads dynamic content
4. Test in admin:
   - Create new wellness tip → Should appear next day
   - Mark article as not featured → Should disappear from homepage
   - Change helpline number → Should update on homepage

---

## 📊 Admin Management Workflows

### Add a New Wellness Tip
1. Admin → Wellness Tips → Add Wellness Tip
2. Fill in title, content, icon name
3. Set display dates (optional)
4. Set target countries (optional, blank = all)
5. Mark as active
6. Save

### Schedule a Promotional Banner
1. Admin → Featured Banners → Add Featured Banner
2. Upload image, add title/subtitle
3. Set `display_from` (e.g., Dec 25, 2026)
4. Set `display_until` (e.g., Jan 1, 2027)
5. Add action button (optional)
6. Mark as active, set display_order = 1
7. Save

Banner will automatically appear/disappear based on dates!

### Send User Notification
1. Admin → User Notifications → Add User Notification
2. Select user
3. Choose notification type
4. Write title & message
5. Set action URL (where user goes when tapped)
6. Save

User will see notification in their bell icon!

### Add Country-Specific Helpline
1. Admin → Crisis Helplines → Add Crisis Helpline
2. Select country
3. Enter name & phone number
4. Mark as primary if main helpline for that country
5. Add languages, description
6. Save

Users from that country will automatically see this helpline!

---

## 🎨 Features & Benefits

### For Admins
✅ No code changes needed to update content
✅ Schedule content in advance
✅ A/B test different banners/tips
✅ Track engagement (views, clicks)
✅ Target by country
✅ Image management built-in

### For Users
✅ Fresh content daily
✅ Personalized (country-specific helplines)
✅ Real notifications
✅ Fast loading (optimized queries)
✅ Professional, polished UI

### For Developers
✅ Type-safe (TypeScript)
✅ Scalable architecture
✅ Easy to extend
✅ Analytics ready
✅ Cache optimized

---

## 🚀 Production Considerations

### Performance
- Implement Redis caching for homepage query
- Add CDN for images
- Lazy load notification badge

### Analytics
- Track which tips get most views
- A/B test different banner images
- Monitor click-through rates

### Content Strategy
- Rotate tips weekly
- Update articles monthly
- Test different helpline descriptions
- Schedule seasonal banners

---

## 📝 Migration Status
✅ All migrations created and applied
✅ Database tables created
✅ Admin interfaces registered
✅ GraphQL schema updated
✅ Frontend types generated

**Ready for use!** Just need to seed data and update the homepage component.
