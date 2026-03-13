import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, List, BarChart3, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>QA Maestro</h1>
        <p>Test Dashboard</p>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className="nav-item">
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/test-runs" className="nav-item">
          <List size={20} />
          <span>Test Runs</span>
        </NavLink>
        
        <NavLink to="/analytics" className="nav-item">
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
}