import { BackendConnectionTest } from '@/components/BackendConnectionTest';

export default function BackendTest() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Backend Integration Test</h1>
        <p className="text-muted-foreground mb-8">
          Testing connection to the backend API running on Google Cloud Run
        </p>
        <BackendConnectionTest />
      </div>
    </div>
  );
}
