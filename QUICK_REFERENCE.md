# Quick Reference - Backend API Integration

## 🚀 Quick Start

```bash
# 1. Test connection
node test-backend-connection.js

# 2. Start dev server
npm run dev

# 3. Open browser
http://localhost:5173
```

## 🔗 Backend URL

```
https://research-system-864580156744.us-central1.run.app
```

## 📦 Import Statements

```typescript
// Custom Hook (Recommended)
import { useBackendApi } from '@/hooks/useBackendApi';

// Direct Services
import { 
  questionsService, 
  responsesService, 
  analyticsService,
  aiService,
  smsService 
} from '@/services/apiService';

// Configuration
import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';
```

## 🎣 Using the Hook

```tsx
function MyComponent() {
  const { 
    loading, 
    error,
    // Questions
    fetchQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    // Responses
    fetchResponses,
    fetchResponse,
    // Analytics
    fetchAnalytics,
    // AI
    triggerAiProcessing,
    // SMS
    sendThankYouSms,
    sendInviteSms,
  } = useBackendApi();

  // Use any method
  const loadData = async () => {
    const result = await fetchQuestions();
    if (result.success) {
      console.log(result.data);
    }
  };
}
```

## 📋 Common Patterns

### Fetch Questions
```typescript
const result = await fetchQuestions({ 
  language: 'en', 
  category: 'health',
  active: true 
});
```

### Fetch Responses
```typescript
const result = await fetchResponses({ 
  page: 1, 
  limit: 50,
  type: 'voice',
  includeAI: true 
});
```

### Fetch Analytics
```typescript
const result = await fetchAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  granularity: 'month'
});
```

### Create Question
```typescript
const result = await createQuestion({
  title: 'Healthcare Survey',
  question_text: 'How would you rate healthcare?',
  category: 'health',
  language: 'en',
  is_active: true
});
```

### Send SMS
```typescript
const result = await sendThankYouSms({
  phoneNumber: '+254712345678',
  language: 'en',
  questionTitle: 'Healthcare Survey'
});
```

## 🔐 Authentication

```typescript
import { authService } from '@/services/apiService';

// Login
const result = await authService.login('username', 'password');
if (result.success) {
  localStorage.setItem('backend_token', result.data.token);
}

// Token is auto-included in subsequent requests
```

## 🧪 Testing

### Browser Console
```javascript
// Health check
fetch('https://research-system-864580156744.us-central1.run.app/health')
  .then(r => r.json())
  .then(console.log);

// Questions
fetch('https://research-system-864580156744.us-central1.run.app/api/questions')
  .then(r => r.json())
  .then(console.log);
```

### Node Script
```bash
node test-backend-connection.js
```

### React Component
```tsx
import { BackendConnectionTest } from '@/components/BackendConnectionTest';

<BackendConnectionTest />
```

## 📊 Response Format

### Success Response
```typescript
{
  success: true,
  data: {
    // Response data
  }
}
```

### Error Response
```typescript
{
  success: false,
  error: "Error message"
}
```

### Paginated Response
```typescript
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 50,
    total: 150,
    pages: 3
  }
}
```

## 🛠️ Troubleshooting

### Check Backend Status
```bash
curl https://research-system-864580156744.us-central1.run.app/health
```

### View Backend Logs
```bash
gcloud run services logs tail research-system --region us-central1
```

### Common Issues

**Connection Timeout**
- Default: 30 seconds
- Increase in `src/config/api.ts`

**CORS Error**
- Backend accepts all origins in dev
- Check browser console for details

**Auth Error**
- Check token in localStorage
- Re-login if expired (24h default)

## 📚 Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Complete setup
- [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) - Detailed API docs
- [Backend API Docs](../research-assistence-back/docs/API.md) - Backend reference

## 🎯 Key Files

```
src/
├── config/
│   └── api.ts              # API configuration
├── services/
│   └── apiService.ts       # API methods
├── hooks/
│   └── useBackendApi.ts    # React hook
└── components/
    └── BackendConnectionTest.tsx  # Test component
```

## ⚡ Quick Commands

```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build

# Test connection
node test-backend-connection.js

# Lint
npm run lint

# Test
npm test
```

## 🌐 Environment

```env
VITE_API_BASE_URL="https://research-system-864580156744.us-central1.run.app"
```

---

**Need Help?** Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) or [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md)
