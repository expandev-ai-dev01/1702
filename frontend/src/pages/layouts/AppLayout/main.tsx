import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@/core/components/ErrorBoundary';

export const AppLayout = () => {
  return (
    <ErrorBoundary fallback={<p>Something went wrong in the layout.</p>}>
      <div className="min-h-screen bg-background font-sans antialiased">
        <main>
          <Outlet />
        </main>
      </div>
    </ErrorBoundary>
  );
};
