# Research Web Assistance - Frontend

AI-Powered Research Data Collection System - Web Interface

## Project Overview

This is the frontend web application for the Research Assistance System. It connects to a backend API running on Google Cloud Run that provides:
- USSD & Voice call data collection
- Google Gemini AI-powered analysis
- Africa's Talking integration
- Real-time analytics and reporting

## Backend Integration

**Backend URL**: `https://research-system-864580156744.us-central1.run.app`

The frontend communicates with the backend API for:
- Research questions management
- Response data and analytics
- AI-powered transcriptions and summaries
- SMS notifications

📚 **See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for complete setup instructions**
📚 **See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for API integration details**

## Quick Start

### 1. Test Backend Connection

```bash
# Quick test (requires Node.js)
node test-backend-connection.js
```

### 2. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Verify Integration

Open your browser console and test:
```javascript
fetch('https://research-system-864580156744.us-central1.run.app/health')
  .then(r => r.json())
  .then(console.log);
```

## Environment Setup

The `.env` file is already configured with:
- Supabase credentials (for auth & database)
- Backend API URL (Google Cloud Run)

```env
VITE_SUPABASE_URL="https://cgfsbezhsmmoliegebnm.supabase.co"
VITE_API_BASE_URL="https://research-system-864580156744.us-central1.run.app"
```

## Using the Backend API

### Option 1: Use the Custom Hook (Recommended)

```tsx
import { useBackendApi } from '@/hooks/useBackendApi';

function MyComponent() {
  const { loading, error, fetchQuestions, fetchAnalytics } = useBackendApi();
  
  useEffect(() => {
    const loadData = async () => {
      const questions = await fetchQuestions({ active: true });
      const analytics = await fetchAnalytics();
      console.log(questions, analytics);
    };
    loadData();
  }, []);
  
  return <div>{/* Your UI */}</div>;
}
```

### Option 2: Direct API Service

```tsx
import { questionsService, analyticsService } from '@/services/apiService';

const questions = await questionsService.list({ language: 'en' });
const analytics = await analyticsService.summary();
```

## Available API Endpoints

- `GET /health` - Health check
- `GET /api/questions` - Fetch research questions
- `GET /api/responses` - Fetch participant responses
- `GET /api/analytics` - Fetch analytics data
- `POST /api/questions` - Create new question
- `POST /sms/thank-you` - Send thank you SMS
- And more... (see [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md))

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
