# Research Web Assistance - Frontend

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-cyan.svg)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Latest-black.svg)](https://ui.shadcn.com/)

> Modern web interface for the AI-Powered Research Data Collection System

**Live Application:** Connected to backend at `https://research-system-864580156744.us-central1.run.app`

## Overview

This is the frontend web application for the Research Assistance System. It provides a comprehensive dashboard for researchers and administrators to manage research questions, view responses, analyze data with AI-powered insights, and monitor system performance.

### Key Features

- **📊 Real-time Analytics Dashboard** - Interactive charts and statistics
- **🔐 Role-based Authentication** - Admin, Researcher, and Viewer roles
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🤖 AI-Powered Insights** - View transcriptions and summaries from Google Gemini AI
- **📞 USSD & Voice Data** - Manage research questions and view participant responses
- **💬 SMS Management** - Send thank you messages and research invitations
- **📈 Data Visualization** - Charts powered by Recharts
- **🎨 Modern UI Components** - Built with shadcn/ui component library
- **⚡ Fast Performance** - Vite for lightning-fast development and builds
- **🔄 Real-time Updates** - Live data synchronization with backend API

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite 5+
- **Styling:** Tailwind CSS 3+
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Charts:** Recharts for data visualization
- **Routing:** React Router v6
- **State Management:** React Context API
- **HTTP Client:** Fetch API with custom hooks
- **Form Handling:** React Hook Form
- **Icons:** Lucide React
- **Animations:** Framer Motion

## Backend Integration

**Backend API URL:** `https://research-system-864580156744.us-central1.run.app`

The frontend communicates with the backend API for:
- Research questions management (CRUD operations)
- Response data and analytics
- AI-powered transcriptions and summaries
- SMS notifications and bulk messaging
- User authentication and authorization
- Real-time system health monitoring

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Backend API running (or use production URL)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd research-web-assistance

# Install dependencies
npm install
```

### Environment Setup

The `.env` file is already configured:

```env
VITE_API_BASE_URL="https://research-system-864580156744.us-central1.run.app"
```

For local backend development, update to:
```env
VITE_API_BASE_URL="http://localhost:3000"
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing Backend Connection

### Quick Test Script

```bash
# Test backend connectivity
node test-backend-connection.js
```

### Browser Console Test

Open browser console and run:
```javascript
fetch('https://research-system-864580156744.us-central1.run.app/health')
  .then(r => r.json())
  .then(console.log);
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345
}
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard widgets
│   ├── layout/         # Layout components
│   ├── public/         # Public-facing components
│   ├── resources/      # Resource management
│   └── ui/             # shadcn/ui components
├── config/             # Configuration files
│   └── api.ts          # API configuration
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useBackendApi.ts    # Backend API hook
│   ├── useAdminRole.ts     # Admin role hook
│   └── use-toast.ts        # Toast notifications
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Auth.tsx
│   ├── AdminDashboard.tsx
│   ├── ResearchQuestions.tsx
│   ├── Participants.tsx
│   ├── Reports.tsx
│   └── ...
├── services/           # API services
│   └── apiService.ts   # API client
├── lib/                # Utility functions
│   └── utils.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Using the Backend API

### Option 1: Custom Hook (Recommended)

```tsx
import { useBackendApi } from '@/hooks/useBackendApi';

function MyComponent() {
  const { 
    loading, 
    error, 
    fetchQuestions, 
    fetchAnalytics,
    fetchResponses 
  } = useBackendApi();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const questions = await fetchQuestions({ active: true });
        const analytics = await fetchAnalytics();
        console.log(questions, analytics);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    loadData();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Your UI */}</div>;
}
```

### Option 2: Direct API Service

```tsx
import { 
  questionsService, 
  analyticsService,
  responsesService,
  smsService 
} from '@/services/apiService';

// Fetch research questions
const questions = await questionsService.list({ 
  language: 'en',
  active: true 
});

// Get analytics summary
const analytics = await analyticsService.summary();

// Fetch responses with filters
const responses = await responsesService.list({
  questionId: 1,
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

// Send SMS
await smsService.sendThankYou({
  phoneNumber: '+254712345678',
  message: 'Thank you for participating!'
});
```

## Available API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /api/health` - Detailed health status

### Research Questions
- `GET /api/questions` - List all questions
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create new question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

### Responses
- `GET /api/responses` - List all responses
- `GET /api/responses/:id` - Get single response
- `GET /api/responses/question/:questionId` - Responses by question

### Analytics
- `GET /api/analytics` - Get analytics summary
- `GET /api/analytics/trends` - Get trend data
- `GET /api/analytics/export` - Export data

### SMS
- `POST /sms/thank-you` - Send thank you SMS
- `POST /sms/invite` - Send research invitation
- `POST /sms/bulk` - Send bulk SMS (Admin only)
- `GET /sms/statistics` - Get SMS statistics

### Transcriptions & AI
- `GET /api/transcriptions` - List transcriptions
- `GET /api/ai-summaries` - List AI summaries
- `GET /api/ai-summaries/:id` - Get single summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

## Available Scripts

```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests with Vitest
```

## Features & Pages

### Public Pages
- **Home** - Landing page with hero video and features
- **About** - About the research system
- **Features** - Detailed feature showcase
- **How It Works** - Step-by-step guide
- **Pricing** - Pricing plans
- **Resources** - Articles and whitepapers
- **Contact** - Contact form
- **Privacy Policy** - Privacy information
- **Terms of Service** - Terms and conditions

### Authenticated Pages
- **Dashboard** - Overview with analytics and charts
- **Research Questions** - Manage research questions
- **Participants** - View participant data
- **Responses** - View and filter responses
- **Transcriptions** - AI transcriptions from voice calls
- **AI Summaries** - Gemini AI analysis and insights
- **Voice Records** - Voice call recordings
- **Reports** - Generate and export reports
- **Settings** - User and system settings

### Admin Pages
- **Admin Dashboard** - System administration
- **User Management** - Manage users and roles
- **SMS Management** - Bulk SMS and notifications
- **System Monitoring** - Performance metrics

## Authentication & Authorization

The app uses JWT-based authentication with role-based access control:

- **Admin** - Full system access
- **Researcher** - Create questions, view responses, send SMS
- **Viewer** - Read-only access to data

Protected routes automatically redirect unauthenticated users to the login page.

## Styling & Theming

The app uses Tailwind CSS with a custom theme configuration:

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { /* custom colors */ },
        secondary: { /* custom colors */ },
        // ... more colors
      }
    }
  }
}
```

shadcn/ui components are customizable via `components.json`.

## Development Tips

### Hot Module Replacement (HMR)

Vite provides instant HMR for fast development:
- Changes reflect immediately in the browser
- State is preserved during updates
- No full page reloads needed

### TypeScript

The project uses strict TypeScript configuration:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Code Organization

- Keep components small and focused
- Use custom hooks for reusable logic
- Organize by feature, not by type
- Use TypeScript interfaces for type safety

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify

```bash
# Build the project
npm run build

# Deploy dist folder to Netlify
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages

```bash
# Update vite.config.ts with base path
export default defineConfig({
  base: '/repository-name/'
})

# Build and deploy
npm run build
npm run deploy
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | Production URL |

## Troubleshooting

### CORS Issues

If you encounter CORS errors:
1. Ensure backend has CORS enabled
2. Check `VITE_API_BASE_URL` is correct
3. Verify backend is running and accessible

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

### TypeScript Errors

```bash
# Run type checking
npm run type-check

# Fix auto-fixable issues
npm run lint -- --fix
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support & Resources

- **Backend API:** https://research-system-864580156744.us-central1.run.app
- **Documentation:** Check the `/docs` folder in backend repository
- **Issues:** Report bugs via GitHub Issues
- **shadcn/ui Docs:** https://ui.shadcn.com/
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **Vite Docs:** https://vitejs.dev/guide/

---

**🎨 Modern UI** • **⚡ Lightning Fast** • **🔐 Secure** • **📱 Responsive**
