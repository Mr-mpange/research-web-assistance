# Test Role Fix

## Quick Test Steps

### 1. Restart Frontend Dev Server

```bash
cd research-web-assistance
npm run dev
```

### 2. Clear Browser Data

Open browser console (F12) and run:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 3. Login with Admin Credentials

- Username: `adminuser`
- Password: `Admin@123`

### 4. Verify Role Display

Check the top-right corner of the dashboard. You should see:
- **Name:** Admin User
- **Role:** admin (in lowercase)

### 5. Check User Dropdown

Click on your profile in the top-right. The dropdown should show:
- Name: Admin User
- Role: admin

## What Changed

### TopNav Component
**Before:**
```typescript
const { profile, signOut } = useAuth();
const displayName = profile?.first_name && profile?.last_name
  ? `${profile.first_name} ${profile.last_name}`
  : "Researcher";
const role = profile?.role || "Researcher";
```

**After:**
```typescript
const { user, signOut } = useAuth();
const displayName = user?.full_name || user?.username || "User";
const role = user?.role || "researcher";
```

### AuthContext
**Added:**
```typescript
profile: User | null; // Alias for backward compatibility
```

## If It Still Shows "Researcher"

1. **Check localStorage:**
   ```javascript
   console.log(JSON.parse(localStorage.getItem('auth_user')));
   ```
   Should show: `{ role: "admin", ... }`

2. **Check login response:**
   - Open Network tab in browser DevTools
   - Login again
   - Check the `/auth/login` response
   - Verify it returns `role: "admin"`

3. **Force refresh:**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Or `Cmd + Shift + R` (Mac)

## Expected Behavior

### Admin User:
- ✅ Sees "admin" role
- ✅ Has access to all features
- ✅ Can manage users
- ✅ Can send bulk SMS

### Researcher User:
- ✅ Sees "researcher" role
- ✅ Has access to research features
- ✅ Cannot manage users
- ✅ Can send thank you SMS

### Viewer User:
- ✅ Sees "viewer" role
- ✅ Read-only access
- ✅ Cannot create or modify data

## Shared Tables Explanation

**This is correct behavior!** Both admin and researcher should see:
- AI Summaries
- Participants
- Research Questions
- Voice Records
- Transcriptions
- Reports

The difference is in **permissions**, not **visibility**:
- Admin can do everything
- Researcher can manage their research
- Viewer can only read

---

**Files Modified:**
- `src/components/layout/TopNav.tsx`
- `src/contexts/AuthContext.tsx`
