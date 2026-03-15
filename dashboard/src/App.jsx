import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import TestRuns from './pages/TestRuns';
import RunDetails from './pages/RunDetails';
import Analytics from './pages/Analytics';
import './styles/dashboard.css';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="dashboard" key="dashboard-v2">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test-runs" element={<TestRuns />} />
            <Route path="/test-runs/:runId" element={<RunDetails />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;