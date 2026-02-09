# Complete Setup Guide - Frontend & Backend Integration

This guide will help you set up and run both the frontend (research-web-assistance) and backend (research-assistance-back) together.

## Architecture Overview

```
┌─────────────────────────────────────┐
│   Frontend (React + Vite)          │
│   research-web-assistance           │
│   Port: 5173 (dev)                  │
└──────────────┬──────────────────────┘
               │
               │ HTTPS API Calls
               │
               ▼
┌─────────────────────────────────────┐
│   Backend (Node.js + Express)      │
│   research-assistance-back          │
│   Google Cloud Run                  │
│   https://research-system-...       │
└─────────────────────────────────────┘
               │
               ├─► Google Gemini AI
               ├─► Africa's Talking APIs
               └─► PostgreSQL Database
```

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git
- Google Cloud account (backend already deployed)
- Internet connection

## Quick Start (5 Minutes)

### 1. Clone & Install Frontend

```bash
# Navigate to frontend directory
cd research-web-assistance

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

### 2. Verify Backend Connection

The backend is already running on Google Cloud Run:
- URL: `https://research-system-864580156744.us-central1.run.app`
- Status: Check at `/health` endpoint

Test the connection:
```bash
curl https://research-system-864580156744.us-central1.run.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-09T...",
  "version": "1.0.0"
}
```

### 3. Test Integration

1. Open your browser to `http://localhost:5173`
2. Navigate to the connection test page (if available)
3. Or use the browser console:

```javascript
// Test health check
fetch('https://research-system-864580156744.us-central1.run.app/health')
  .then(r => r.json())
  .then(console.log);
```

## Environment Configuration

### Frontend (.env)

The frontend is already configured with the backend URL:

```env
# Supabase Configuration (for auth & database)
VITE_SUPABASE_PROJECT_ID="cgfsbezhsmmoliegebnm"
VITE_SUPABASE_PUBLISHABLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
VITE_SUPABASE_URL="https://cgfsbezhsmmoliegebnm.supabase.co"

# Backend API Configuration
VITE_API_BASE_URL="https://research-system-864580156744.us-central1.run.app"
```

### Backend (Google Cloud Run)

The backend is deployed with these environment variables:
- `NODE_ENV=production`
- `GEMINI_API_KEY` (stored in Secret Manager)
- `AT_API_KEY` (stored in Secret Manager)
- `PORT=8080`

## Development Workflow

### Running Frontend Only

```bash
cd research-web-assistance
npm run dev
```

The frontend will connect to the production backend on Google Cloud Run.

### Running Backend Locally (Optional)

If you need to run the backend locally for development:

```bash
cd research-assistence-back

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

Then update frontend `.env`:
```env
VITE_API_BASE_URL="http://localhost:3000"
```

## Testing the Integration

### 1. Health Check Test

Create a test component or use the browser console:

```javascript
// In browser console
fetch('https://research-system-864580156744.us-central1.run.app/health')
  .then(r => r.json())
  .then(data => console.log('Backend Status:', data));
```

### 2. API Endpoints Test

```javascript
// Test questions endpoint
fetch('https://research-system-864580156744.us-central1.run.app/api/questions')
  .then(r => r.json())
  .then(data => console.log('Questions:', data));
```

### 3. Using the React Hook

```tsx
import { useBackendApi } from '@/hooks/useBackendApi';

function TestComponent() {
  const { checkHealth, fetchQuestions } = useBackendApi();
  
  useEffect(() => {
    const test = async () => {
      // Test health
      const health = await checkHealth();
      console.log('Health:', health);
      
      // Test questions
      const questions = await fetchQuestions();
      console.log('Questions:', questions);
    };
    test();
  }, []);
  
  return <div>Check console for results</div>;
}
```

## Available Scripts

### Frontend

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm test             # Run tests
```

### Backend (if running locally)

```bash
npm run dev          # Start development server (port 3000)
npm run start        # Start production server
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database
npm run db:reset     # Reset database
npm test             # Run tests
```

## Common Integration Patterns

### 1. Fetching Research Questions

```tsx
import { useEffect, useState } from 'react';
import { useBackendApi } from '@/hooks/useBackendApi';

function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const { loading, error, fetchQuestions } = useBackendApi();

  useEffect(() => {
    const load = async () => {
      const result = await fetchQuestions({ active: true });
      if (result.success) {
        setQuestions(result.data.questions || []);
      }
    };
    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {questions.map(q => (
        <div key={q.id}>{q.title}</div>
      ))}
    </div>
  );
}
```

### 2. Fetching Analytics Data

```tsx
import { useBackendApi } from '@/hooks/useBackendApi';

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const { fetchAnalytics } = useBackendApi();

  useEffect(() => {
    const load = async () => {
      const result = await fetchAnalytics({
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        granularity: 'month'
      });
      if (result.success) {
        setAnalytics(result.data);
      }
    };
    load();
  }, []);

  return <div>{/* Display analytics */}</div>;
}
```

### 3. Creating Research Questions

```tsx
import { useBackendApi } from '@/hooks/useBackendApi';

function CreateQuestion() {
  const { createQuestion } = useBackendApi();

  const handleSubmit = async (data) => {
    const result = await createQuestion({
      title: data.title,
      question_text: data.text,
      category: data.category,
      language: 'en',
      is_active: true
    });

    if (result.success) {
      alert('Question created!');
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

## Troubleshooting

### Frontend Can't Connect to Backend

1. **Check backend status:**
   ```bash
   curl https://research-system-864580156744.us-central1.run.app/health
   ```

2. **Check environment variable:**
   - Verify `VITE_API_BASE_URL` in `.env`
   - Restart dev server after changing `.env`

3. **Check browser console:**
   - Look for CORS errors
   - Check network tab for failed requests

### CORS Errors

The backend is configured to accept requests from any origin in development. If you see CORS errors:

1. Verify the backend is running
2. Check that requests include proper headers
3. For production, add your frontend URL to backend's `ALLOWED_ORIGINS`

### Authentication Issues

If you need to authenticate with the backend:

```typescript
import { authService } from '@/services/apiService';

// Login
const result = await authService.login('username', 'password');
if (result.success) {
  localStorage.setItem('backend_token', result.data.token);
}
```

### Timeout Errors

If requests timeout (default 30s):

1. Check backend logs for slow queries
2. Increase timeout in `src/config/api.ts`:
   ```typescript
   export const REQUEST_TIMEOUT = 60000; // 60 seconds
   ```

## Production Deployment

### Frontend Deployment

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy to hosting service:**
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - Firebase: `firebase deploy`

3. **Update environment variables:**
   - Set `VITE_API_BASE_URL` to production backend URL
   - Configure other production variables

### Backend CORS Configuration

Update backend's `ALLOWED_ORIGINS` environment variable:

```bash
gcloud run services update research-system \
  --update-env-vars ALLOWED_ORIGINS="https://your-frontend-domain.com" \
  --region us-central1
```

## Monitoring & Debugging

### Backend Logs

View backend logs on Google Cloud:

```bash
gcloud run services logs tail research-system --region us-central1
```

### Frontend Debugging

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API requests
4. Use React DevTools for component debugging

## Next Steps

1. ✅ Frontend and backend are connected
2. 📝 Implement authentication flow
3. 📊 Build dashboard with real backend data
4. 🧪 Add comprehensive tests
5. 🚀 Deploy to production

## Resources

- [Backend API Documentation](../research-assistence-back/docs/API.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION.md)
- [Backend README](../research-assistence-back/README.md)
- [Google Cloud Run Docs](https://cloud.google.com/run/docs)

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review backend logs
3. Test endpoints with curl or Postman
4. Check browser console for errors

---

**You're all set!** The frontend and backend are now connected and ready for development. 🎉
