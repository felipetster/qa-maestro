import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import ReleaseConfidence from '../components/ReleaseConfidence';
import HealthScore from '../components/HealthScore';
import FailureClusters from '../components/FailureClusters';
import TestStabilityMap from '../components/TestStabilityMap';
import TestRunsList from '../components/TestRunsList';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [recentRuns, setRecentRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, runsRes] = await Promise.all([
        axios.get('http://localhost:3001/api/stats'),
        axios.get('http://localhost:3001/api/test-runs')
      ]);
      
      setStats(statsRes.data);
      setRecentRuns(runsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Calcula métricas do snapshot
  const totalTests = stats?.total_tests || 0;
  const passRate = totalTests > 0 
    ? Math.round((stats.total_passed / totalTests) * 100) 
    : 100;

  return (
    <div className="main-content">
      <div className="page-header">
        <h2>QA Maestro</h2>
        <p>Engineering Intelligence Platform</p>
      </div>

      {/* ============================================
          1️⃣ RELEASE DECISION (PRIMEIRO - MAIS IMPORTANTE)
          ============================================ */}
      <ReleaseConfidence />

      {/* ============================================
          2️⃣ HEALTH SNAPSHOT (MÉTRICAS RÁPIDAS)
          ============================================ */}
      <div className="health-snapshot">
        <div className="snapshot-card">
          <div className="snapshot-icon">
            <Activity size={20} />
          </div>
          <div className="snapshot-content">
            <div className="snapshot-label">Total Tests</div>
            <div className="snapshot-value">{totalTests}</div>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-icon success">
            <CheckCircle size={20} />
          </div>
          <div className="snapshot-content">
            <div className="snapshot-label">Pass Rate</div>
            <div className="snapshot-value">{passRate}%</div>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-icon warning">
            <AlertTriangle size={20} />
          </div>
          <div className="snapshot-content">
            <div className="snapshot-label">Flaky Tests</div>
            <div className="snapshot-value">2</div>
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-icon primary">
            <TrendingUp size={20} />
          </div>
          <div className="snapshot-content">
            <div className="snapshot-label">Health Score</div>
            <div className="snapshot-value">89</div>
          </div>
        </div>
      </div>

      {/* ============================================
          3️⃣ ACTIVE ISSUES (PROBLEMAS DETECTADOS)
          ============================================ */}
      <div className="section-header">
        <h3>Active Issues</h3>
        <p>Problems detected automatically</p>
      </div>
      <FailureClusters />

      {/* ============================================
          4️⃣ TEST SUITE HEALTH (DIAGNÓSTICO)
          ============================================ */}
      <div className="section-header">
        <h3>Test Suite Health</h3>
        <p>Quality assessment and insights</p>
      </div>
      <HealthScore />

      {/* ============================================
          5️⃣ TEST STABILITY MAP (RISCO ESCONDIDO)
          ============================================ */}
      <div className="section-header">
        <h3>Test Stability Overview</h3>
        <p>Risk detection and flaky test analysis</p>
      </div>
      <TestStabilityMap />

      {/* ============================================
          6️⃣ RECENT RUNS (CONTEXTO OPERACIONAL)
          ============================================ */}
      <div className="section-header">
        <h3>Recent Test Runs</h3>
        <p>Execution history and trends</p>
      </div>
      <TestRunsList runs={recentRuns} />
    </div>
  );
}