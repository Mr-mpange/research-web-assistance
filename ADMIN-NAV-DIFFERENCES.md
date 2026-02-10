# Admin vs Researcher Navigation Differences

## ✅ Changes Made

### Navigation Items by Role

#### **Admin Users See:**
1. ✅ Dashboard Overview
2. ✅ Voice Records
3. ✅ Transcriptions
4. ✅ AI Summaries
5. ✅ Research Questions
6. ✅ Participants
7. ✅ Reports & Exports
8. ✅ **Admin Dashboard** (Admin Only)
9. ✅ **SMS Management** (Admin + Researcher)
10. ✅ Settings

#### **Researcher Users See:**
1. ✅ Dashboard Overview
2. ✅ Voice Records
3. ✅ Transcriptions
4. ✅ AI Summaries
5. ✅ Research Questions
6. ✅ Participants
7. ✅ Reports & Exports
8. ✅ SMS Management
9. ✅ Settings

#### **Viewer Users See:**
1. ✅ Dashboard Overview
2. ✅ Voice Records
3. ✅ Transcriptions
4. ✅ AI Summaries
5. ✅ Participants
6. ✅ Reports & Exports
7. ✅ Settings

## Key Differences

### Admin-Only Features:
- **Admin Dashboard** (`/admin`) - System administration, user management
- Full access to all features
- Can manage users and system settings

### Researcher Features:
- Can create and manage research questions
- Can send SMS notifications
- Can view and analyze data
- Cannot access admin dashboard
- Cannot manage users

### Viewer Features:
- Read-only access to data
- Cannot create or modify research questions
- Cannot send SMS
- Cannot access admin features

## Files Modified

1. **`src/components/layout/Sidebar.tsx`**
   - Added role-based filtering
   - Added `roles` array to each navigation item
   - Filters menu items based on `user.role`
   - Added new icons: `Shield` (Admin), `MessageSquare` (SMS)

2. **`src/pages/SMSManagement.tsx`**
   - Created new SMS Management page
   - Send individual SMS
   - Bulk SMS for admins
   - SMS statistics and history

3. **`src/App.tsx`**
   - Added SMS Management route
   - Route accessible to admin and researcher

## Navigation Item Roles

```typescript
const navigation = [
  { name: "Dashboard Overview", roles: ['admin', 'researcher', 'viewer'] },
  { name: "Voice Records", roles: ['admin', 'researcher', 'viewer'] },
  { name: "Transcriptions", roles: ['admin', 'researcher', 'viewer'] },
  { name: "AI Summaries", roles: ['admin', 'researcher', 'viewer'] },
  { name: "Research Questions", roles: ['admin', 'researcher'] }, // Viewers can't edit
  { name: "Participants", roles: ['admin', 'researcher', 'viewer'] },
  { name: "Reports & Exports", roles: ['admin', 'researcher', 'viewer'] },
  { name: "Admin Dashboard", roles: ['admin'] }, // Admin only
  { name: "SMS Management", roles: ['admin', 'researcher'] }, // No viewers
];
```

## How It Works

The Sidebar component now:
1. Gets the current user from `useAuth()`
2. Filters navigation items based on `user.role`
3. Only shows menu items where the user's role is in the `roles` array
4. Dynamically updates when user logs in/out

## Testing

### As Admin:
1. Login with: `adminuser` / `Admin@123`
2. You should see **9 menu items** including "Admin Dashboard"
3. Profile shows: "admin" role

### As Researcher:
1. Create a researcher account
2. You should see **8 menu items** (no Admin Dashboard)
3. Profile shows: "researcher" role

### As Viewer:
1. Create a viewer account
2. You should see **7 menu items** (no Admin Dashboard, no Research Questions, no SMS)
3. Profile shows: "viewer" role

## To See Changes

1. **Restart frontend dev server:**
   ```bash
   cd research-web-assistance
   npm run dev
   ```

2. **Clear browser cache** (Ctrl + Shift + R)

3. **Logout and login again** as admin

4. **Check sidebar** - You should now see:
   - "Admin Dashboard" menu item (with shield icon)
   - "SMS Management" menu item (with message icon)

## Next Steps

If you want to add more admin-only features:

1. Add the menu item to `navigation` array with `roles: ['admin']`
2. Create the page component
3. Add the route in `App.tsx`
4. Optionally wrap route with `<AdminRoute>` for extra protection

---

**Last Updated:** 2026-02-10
