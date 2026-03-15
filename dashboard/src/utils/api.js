import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const AI_BASE_URL = import.meta.env.VITE_AI_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const aiApi = axios.create({
  baseURL: AI_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// test runs
export const getTestRuns = () => api.get('/api/test-runs');
export const getTestRun = (runId) => api.get(`/api/test-runs/${runId}`);
export const getStats = () => api.get('/api/stats');

// ai analysis
export const getAIAnalysis = (runId) => api.get(`/api/test-runs/${runId}/analysis`);
export const triggerAIAnalysis = (runId) => api.post(`/api/test-runs/${runId}/analyze`);

// ai service
export const getPerformanceTrends = () => aiApi.post('/api/analyze/performance');
export const getFlakyTests = (testName) => aiApi.post(`/api/analyze/flaky/${testName}`);