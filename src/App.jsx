import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProviders } from './context';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import NewsPage from './pages/NewsPage';
import Chatbot from './chatbot/Chatbot';
import { Menu } from 'lucide-react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <AppProviders>
        <div className="flex min-h-screen bg-background">
          <Toaster position="top-right" />
          
          <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

          <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden p-4 border-b border-border flex items-center justify-between glass">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-primary rounded-lg text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M6.7 6.7 17.3 17.3"/><path d="m17.3 6.7-10.6 10.6"/></svg>
                </div>
                <h1 className="font-bold">OrbitScope</h1>
              </div>
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-lg"
              >
                <Menu size={24} />
              </button>
            </header>

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/news" element={<NewsPage />} />
            </Routes>
          </main>

          <Chatbot />
        </div>
      </AppProviders>
    </Router>
  );
}

export default App;
