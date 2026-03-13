import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function FlakyTestsChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Flaky Tests</h3>
        </div>
        <p style={{ 
          color: 'var(--gray-500)', 
          padding: 20, 
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          No flaky tests detected. All tests are stable! 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Flaky Tests</h3>
        <span style={{ 
          fontSize: 13, 
          color: 'var(--gray-500)', 
          fontWeight: 600 
        }}>
          Tests with inconsistent results
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="test_name" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            stroke="#6b7280"
            style={{ fontSize: 11, fontWeight: 600 }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{ fontSize: 13, fontWeight: 600 }}
          />
          <Bar 
            dataKey="passed_runs" 
            fill="#10b981" 
            name="Passed" 
            radius={[8, 8, 0, 0]}
          />
          <Bar 
            dataKey="failed_runs" 
            fill="#ef4444" 
            name="Failed" 
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}