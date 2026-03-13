import React, { useState, useEffect } from 'react';
import { getTestRuns } from '../utils/api';
import Header from '../components/Header';
import TestRunsList from '../components/TestRunsList';

export default function TestRuns() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      setLoading(true);
      const response = await getTestRuns();
      setRuns(response.data);
    } catch (error) {
      console.error('Error fetching runs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <Header 
        title="Test Runs" 
        subtitle="Complete history of all test executions"
      />

      <TestRunsList runs={runs} loading={loading} />
    </div>
  );
}