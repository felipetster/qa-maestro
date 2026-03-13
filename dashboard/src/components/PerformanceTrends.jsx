import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function PerformanceTrends({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Performance Trends</h3>
        </div>
        <p style={{ color: 'var(--gray-500)', padding: 20, fontWeight: 500 }}>
          Not enough data to show trends. Run more tests!
        </p>
      </div>
    );
  }

  // INVERTE ORDEM: do mais antigo pro mais novo (esquerda → direita)
  const sortedData = [...data].reverse();

  // Formata dados para o gráfico
  const chartData = sortedData.map(run => ({
    name: run.run_id,
    duration: run.duration_ms / 1000, // Converte pra segundos
    passed: run.passed,
    failed: run.failed
  }));

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Performance Trends</h3>
        <span style={{ 
          fontSize: 13, 
          color: 'var(--gray-500)', 
          fontWeight: 600 
        }}>
          Duration over time (seconds)
        </span>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280"
            style={{ fontSize: 12, fontWeight: 600 }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: 12, fontWeight: 600 }}
            label={{ 
              value: 'Duration (s)', 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12, fontWeight: 600, fill: '#6b7280' }
            }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="duration" 
            stroke="#3b82f6" 
            strokeWidth={3}
            fill="url(#colorDuration)"
            name="Duration"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}