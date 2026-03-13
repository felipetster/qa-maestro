import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  trend, 
  color = 'primary',
  subtitle = 'Last 7 days' 
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-card-icon ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      
      <div className="stat-card-value">{value}</div>
      
      {subtitle && (
        <div className="stat-card-subtitle">{subtitle}</div>
      )}
      
      {change && (
        <div className={`stat-card-change ${trend}`}>
          {trend === 'positive' ? (
            <>
              <TrendingUp size={14} />
              +{change}
            </>
          ) : (
            <>
              <TrendingDown size={14} />
              {change}
            </>
          )}
        </div>
      )}
    </div>
  );
}