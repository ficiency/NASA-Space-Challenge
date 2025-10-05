import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { MexicoMap } from './components/MexicoMap';
import { SidebarProvider, SidebarInset } from './components/ui/sidebar';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'map':
        return <MexicoMap />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
        <SidebarInset className="flex-1 overflow-auto">
          <main className="h-full">
            {renderCurrentPage()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}