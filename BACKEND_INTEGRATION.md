# Backend Integration Guide

This guide explains how to connect the research-web-assistance frontend with the research-assistance-back backend running on Google Cloud Run.

## Backend Information

- **Backend URL**: `https://research-system-864580156744.us-central1.run.app`
- **Project ID**: `trans-campus-480505-i2`
- **Region**: `us-central1`
- **Platform**: Google Cloud Run

## Setup Instructions

### 1. Environment Configuration

The backend URL is already configured in `.env`:

```env
VITE_API_BASE_URL="https://research-system-864580156744.us-central1.run.app"
```

If your backend URL changes, update this value.

### 2. Install Dependencies

Make sure all dependencies are installed:

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The frontend will now communicate with the backend on Google Cloud Run.

## API Integration

### Using the Custom Hook

The easiest way to interact with the backend is using the `useBackendApi` hook:

```tsx
import { useBackendApi } from '@/hooks/useBackendApi';

function MyComponent() {
  const { 
    loading, 
    error, 
    fetchQuestions, 
    fetchResponses,
    fetchAnalytics 
  } = useBackendApi();

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchQuestions({ language: 'en', active: true });
      if (result.success) {
        console.log('Questions:', result.data);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Your component content */}
    </div>
  );
}
```

### Direct API Service Usage

You can also use the API services directly:

```tsx
import { questionsService, responsesService, analyticsService } from '@/services/apiService';

// Fetch questions
const result = await questionsService.list({ language: 'en' }, token);

// Fetch responses
const responses = await responsesService.list({ page: 1, limit: 50 }, token);

// Fetch analytics
const analytics = await analyticsService.summary({
  startDate: '2024-01-01',
  endDate: '2024-01-31'
}, token);
```

## Available API Endpoints

### Health Check
```typescript
GET /health
```

### Authentication
```typescript
POST /auth/login
POST /auth/register
```

### Research Questions
```typescript
GET    /api/questions
POST   /api/questions
PUT    /api/questions/:id
DELETE /api/questions/:id
```

### Research Responses
```typescript
GET /api/responses
GET /api/responses/:id
GET /api/responses/export
```

### Analytics
```typescript
GET /api/analytics
GET /api/analytics/trends
GET /api/analytics/sentiments
```

### AI Processing
```typescript
POST /api/ai/process
GET  /api/ai/status
```

### SMS
```typescript
POST /sms/thank-you
POST /sms/invite
POST /sms/bulk
GET  /sms/statistics
```

## Authentication

The backend uses JWT authentication. To authenticate:

1. Login via the backend API:
```typescript
import { authService } from '@/services/apiService';

const result = await authService.login('username', 'password');
if (result.success) {
  const token = result.data.token;
  localStorage.setItem('backend_token', token);
}
```

2. The token is automatically included in subsequent requests via the `useBackendApi` hook.

## CORS Configuration

The backend is configured to accept requests from your frontend. If you encounter CORS issues:

1. Check that the backend's `ALLOWED_ORIGINS` environment variable includes your frontend URL
2. For development, the backend accepts all origins when `NODE_ENV=development`

## Testing the Connection

### 1. Health Check

Test if the backend is accessible:

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

### 2. Test from Frontend

Create a test component:

```tsx
import { useEffect, useState } from 'react';
import { healthCheck } from '@/services/apiService';

function ConnectionTest() {
  const [status, setStatus] = useState<string>('Testing...');

  useEffect(() => {
    const test = async () => {
      const result = await healthCheck();
      if (result.success) {
        setStatus('✅ Connected to backend!');
      } else {
        setStatus(`❌ Connection failed: ${result.error}`);
      }
    };
    test();
  }, []);

  return <div>{status}</div>;
}
```

## Example: Fetching Research Data

Here's a complete example of fetching and displaying research questions:

```tsx
import { useEffect, useState } from 'react';
import { useBackendApi } from '@/hooks/useBackendApi';

function ResearchQuestions() {
  const [questions, setQuestions] = useState([]);
  const { loading, error, fetchQuestions } = useBackendApi();

  useEffect(() => {
    const loadQuestions = async () => {
      const result = await fetchQuestions({ 
        language: 'en', 
        active: true 
      });
      
      if (result.success && result.data) {
        setQuestions(result.data.questions || []);
      }
    };
    
    loadQuestions();
  }, [fetchQuestions]);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Research Questions</h2>
      <ul>
        {questions.map((q: any) => (
          <li key={q.id}>
            <h3>{q.title}</h3>
            <p>{q.question_text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Troubleshooting

### Connection Refused
- Verify the backend URL in `.env`
- Check if the backend is running: `curl https://research-system-864580156744.us-central1.run.app/health`

### CORS Errors
- Ensure the backend's CORS configuration includes your frontend URL
- Check browser console for specific CORS error messages

### Authentication Errors
- Verify JWT token is stored correctly
- Check token expiration (default: 24h)
- Re-login if token is expired

### Timeout Errors
- Default timeout is 30 seconds
- Check backend logs for slow queries
- Consider increasing timeout in `src/config/api.ts`

## Production Deployment

When deploying to production:

1. Update `.env` with production backend URL
2. Ensure HTTPS is enabled
3. Configure proper CORS origins on backend
4. Use environment-specific API keys
5. Enable error tracking (Sentry, etc.)

## Backend Documentation

For complete backend API documentation, see:
- [Backend API Docs](../research-assistence-back/docs/API.md)
- [Backend README](../research-assistence-back/README.md)
- [Deployment Guide](../research-assistence-back/docs/DEPLOYMENT.md)

## Support

If you encounter issues:
1. Check backend logs: `gcloud run services logs tail research-system --region us-central1`
2. Verify backend health: `curl https://research-system-864580156744.us-central1.run.app/health`
3. Check browser console for frontend errors
4. Review network tab in browser DevTools
