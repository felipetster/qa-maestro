import React, { useState, useEffect } from 'react';
import { getTestRuns } from '../utils/api';
import Header from '../components/Header';
import FlakyTestsChart from '../components/FlakyTestsChart';
import PerformanceTrends from '../components/PerformanceTrends';

export default function Analytics() {
  const [runs, setRuns] = useState([]);
  const [flakyTests, setFlakyTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getTestRuns();
      setRuns(response.data);
      
      // Mock flaky tests data (replace with real API)
      setFlakyTests([
        { test_name: 'TC003', passed_runs: 8, failed_runs: 2, total_runs: 10 },
        { test_name: 'TC007', passed_runs: 7, failed_runs: 3, total_runs: 10 }
      ]);
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
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <Header 
        title="Analytics" 
        subtitle="Deep insights into test quality and performance"
      />

      <PerformanceTrends data={runs} />
      <FlakyTestsChart data={flakyTests} />
    </div>
  );
}