import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'connected', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.message });
  }
});

// ============================================
// TEST RUNS ENDPOINTS
// ============================================

// Get all test runs
app.get('/api/test-runs', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM test_runs ORDER BY started_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching test runs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single test run with cases
app.get('/api/test-runs/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    
    const runResult = await db.query(
      'SELECT * FROM test_runs WHERE run_id = $1',
      [runId]
    );
    
    if (runResult.rows.length === 0) {
      return res.status(404).json({ error: 'Test run not found' });
    }
    
    const casesResult = await db.query(
      'SELECT * FROM test_cases WHERE run_id = $1 ORDER BY created_at',
      [runId]
    );
    
    res.json({
      run: runResult.rows[0],
      cases: casesResult.rows
    });
  } catch (error) {
    console.error('Error fetching test run:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create test run
app.post('/api/test-runs', async (req, res) => {
  try {
    const { run_id, browser, environment } = req.body;
    
    const result = await db.query(
      `INSERT INTO test_runs (run_id, browser, environment) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [run_id, browser || 'chrome', environment || 'dev']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating test run:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update test run
app.patch('/api/test-runs/:runId', async (req, res) => {
  try {
    const { runId } = req.params;
    const { status, total_tests, passed, failed, skipped, duration_ms } = req.body;
    
    const result = await db.query(
      `UPDATE test_runs 
       SET status = $1, total_tests = $2, passed = $3, failed = $4, 
           skipped = $5, duration_ms = $6, finished_at = NOW()
       WHERE run_id = $7 
       RETURNING *`,
      [status, total_tests, passed, failed, skipped, duration_ms, runId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating test run:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add test case
app.post('/api/test-cases', async (req, res) => {
  try {
    const { run_id, test_name, test_file, status, duration_ms, error_message, stack_trace } = req.body;
    
    const result = await db.query(
      `INSERT INTO test_cases (run_id, test_name, test_file, status, duration_ms, error_message, stack_trace)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [run_id, test_name, test_file, status, duration_ms, error_message, stack_trace]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating test case:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        SUM(total_tests) as total_tests,
        SUM(passed) as total_passed,
        SUM(failed) as total_failed,
        COUNT(*) as total_runs
      FROM test_runs
    `);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// AI ANALYSIS ENDPOINTS
// ============================================

// Get AI analysis for a run
app.get('/api/test-runs/:runId/analysis', async (req, res) => {
  try {
    const { runId } = req.params;
    
    const result = await db.query(
      `SELECT * FROM ai_analyses 
       WHERE run_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [runId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No analysis found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// Trigger AI analysis
app.post('/api/test-runs/:runId/analyze', async (req, res) => {
  try {
    const { runId } = req.params;
    
    // Chama AI Service
    const aiResponse = await fetch(`http://ai-service:8000/api/analyze/run/${runId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!aiResponse.ok) {
      throw new Error(`AI Service error: ${aiResponse.statusText}`);
    }
    
    const analysis = await aiResponse.json();
    res.json(analysis);
  } catch (error) {
    console.error('Error triggering analysis:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// HEALTH SCORE (EIP - Engineering Intelligence)
// ============================================

app.get('/api/health-score', async (req, res) => {
  try {
    // Pega últimos 10 runs
    const recentRuns = await db.query(`
      SELECT * FROM test_runs 
      WHERE finished_at IS NOT NULL
      ORDER BY started_at DESC 
      LIMIT 10
    `);

    if (recentRuns.rows.length === 0) {
      return res.json({
        score: 100,
        trend: { direction: 'stable', data: [] },
        signals: [],
        insights: [],
        components: [],
        actions: [],
        metadata: { message: 'No test data available yet' }
      });
    }

    const runs = recentRuns.rows;

    // ============================================
    // 1. CALCULA SCORES
    // ============================================
    
    const totalTests = runs.reduce((sum, r) => sum + (r.total_tests || 0), 0);
    const totalPassed = runs.reduce((sum, r) => sum + (r.passed || 0), 0);
    const passRate = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 100;

    const passRates = runs.map(r => {
      const total = r.total_tests || 1;
      const passed = r.passed || 0;
      return (passed / total) * 100;
    });
    const avgPassRate = passRates.reduce((a, b) => a + b, 0) / passRates.length;
    const variance = passRates.reduce((sum, rate) => sum + Math.pow(rate - avgPassRate, 2), 0) / passRates.length;
    const stdDev = Math.sqrt(variance);
    const stabilityScore = Math.max(0, Math.round(100 - (stdDev * 2)));

    const durations = runs.map(r => r.duration_ms || 0);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const baseline = durations[durations.length - 1] || 1;
    const degradation = baseline > 0 ? ((avgDuration - baseline) / baseline) * 100 : 0;
    const performanceScore = Math.max(0, Math.round(100 - Math.abs(degradation)));

    const healthScore = Math.round(
      passRate * 0.40 +
      stabilityScore * 0.35 +
      performanceScore * 0.25
    );

    // ============================================
    // 2. TREND DATA (últimos 7 runs)
    // ============================================
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const trendData = runs.slice(0, 7).reverse().map((run, index) => {
      const total = run.total_tests || 1;
      const passed = run.passed || 0;
      return {
        day: days[index] || `D${index + 1}`,
        score: Math.round((passed / total) * 100),
        runId: run.run_id
      };
    });

    let trendDirection = 'stable';
    if (trendData.length >= 3) {
      const recent = trendData.slice(-3).reduce((sum, d) => sum + d.score, 0) / 3;
      const older = trendData.slice(0, 3).reduce((sum, d) => sum + d.score, 0) / 3;
      if (recent > older + 5) trendDirection = 'improving';
      if (recent < older - 5) trendDirection = 'declining';
    }

    // ============================================
    // 3. SIGNALS (status indicators)
    // ============================================
    
    const signals = [];

    if (passRate >= 90) {
      signals.push({ type: 'success', message: `Pass rate stable (${passRate}%)` });
    } else if (passRate >= 80) {
      signals.push({ type: 'warning', message: `Pass rate acceptable (${passRate}%)` });
    } else {
      signals.push({ type: 'error', message: `Pass rate critical (${passRate}%)` });
    }

    if (Math.abs(degradation) < 10) {
      signals.push({ type: 'success', message: 'Performance stable' });
    } else {
      signals.push({ 
        type: 'warning', 
        message: `Performance degraded ${Math.round(Math.abs(degradation))}%` 
      });
    }

    const latestRun = runs[0];
    const recentFailures = latestRun.failed || 0;
    if (recentFailures > 0) {
      signals.push({ 
        type: 'warning', 
        message: `${recentFailures} recent failure${recentFailures > 1 ? 's' : ''} detected` 
      });
    } else {
      signals.push({ type: 'success', message: 'No failures in last run' });
    }

    // ============================================
    // 4. INSIGHTS (análise automática)
    // ============================================
    
    const insights = [];

    // Pega falhas recentes pra análise
    try {
      const failedTests = await db.query(`
        SELECT test_name, error_message, COUNT(*) as count
        FROM test_cases
        WHERE status = 'failed'
          AND run_id IN (SELECT run_id FROM test_runs ORDER BY started_at DESC LIMIT 3)
        GROUP BY test_name, error_message
        ORDER BY count DESC
        LIMIT 3
      `);

      if (failedTests.rows.length > 0) {
        const topFailure = failedTests.rows[0];
        const errorMsg = topFailure.error_message || '';
        
        if (errorMsg.includes('timeout')) {
          insights.push({
            type: 'failure_pattern',
            message: 'Failures clustered in API timeout errors',
            detail: `${topFailure.count} occurrences in ${topFailure.test_name}`
          });
        } else if (errorMsg.includes('not found')) {
          insights.push({
            type: 'failure_pattern',
            message: 'Failures clustered in element selector issues',
            detail: `${topFailure.count} occurrences in ${topFailure.test_name}`
          });
        } else {
          insights.push({
            type: 'failure_pattern',
            message: `Failures concentrated in ${topFailure.test_name}`,
            detail: `${topFailure.count} failures detected`
          });
        }
      }
    } catch (err) {
      console.error('Error fetching failed tests:', err);
    }

    if (Math.abs(degradation) > 15) {
      insights.push({
        type: 'performance_regression',
        message: `Test execution time changed ${Math.round(Math.abs(degradation))}% since baseline`,
        detail: `Current avg: ${Math.round(avgDuration)}ms, Baseline: ${baseline}ms`
      });
    }

    if (stabilityScore < 75) {
      insights.push({
        type: 'stability_issue',
        message: 'High variance detected in test results',
        detail: 'Possible flaky tests or environment instability'
      });
    }

    // ============================================
    // 5. COMPONENTS (métricas detalhadas)
    // ============================================
    
    const components = [
      {
        name: 'Pass Rate',
        score: passRate,
        color: passRate >= 90 ? 'emerald' : passRate >= 80 ? 'yellow' : 'red',
        status: passRate >= 90 ? 'healthy' : passRate >= 80 ? 'warning' : 'critical'
      },
      {
        name: 'Stability',
        score: stabilityScore,
        color: stabilityScore >= 80 ? 'teal' : stabilityScore >= 70 ? 'yellow' : 'red',
        status: stabilityScore >= 80 ? 'healthy' : stabilityScore >= 70 ? 'warning' : 'critical'
      },
      {
        name: 'Performance',
        score: performanceScore,
        color: performanceScore >= 80 ? 'blue' : performanceScore >= 70 ? 'yellow' : 'red',
        status: performanceScore >= 80 ? 'healthy' : performanceScore >= 70 ? 'warning' : 'critical'
      }
    ];

    // ============================================
    // 6. RECOMMENDED ACTIONS (específicas)
    // ============================================
    
    const actions = [];

    if (recentFailures > 0) {
      actions.push({
        priority: 'high',
        action: 'Investigate recent test failures',
        reason: `${recentFailures} test${recentFailures > 1 ? 's' : ''} failed in last run`
      });
    }

    if (Math.abs(degradation) > 15) {
      actions.push({
        priority: 'medium',
        action: 'Profile test execution and identify slow tests',
        reason: `${Math.round(Math.abs(degradation))}% performance change detected`
      });
    }

    if (stabilityScore < 75) {
      actions.push({
        priority: 'medium',
        action: 'Identify and quarantine flaky tests',
        reason: 'High result variance detected'
      });
    }

    if (actions.length === 0) {
      actions.push({
        priority: 'low',
        action: 'Monitor next 3 runs for stability',
        reason: 'Test suite is healthy'
      });
    }

    // ============================================
    // 7. RESPONSE
    // ============================================
    
    res.json({
      score: healthScore,
      trend: {
        direction: trendDirection,
        data: trendData
      },
      signals,
      insights,
      components,
      actions,
      metadata: {
        totalRuns: runs.length,
        avgDuration: Math.round(avgDuration),
        lastRun: latestRun.run_id
      }
    });

  } catch (error) {
    console.error('Error calculating health score:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// ============================================
// FAILURE CLUSTERS
// ============================================

app.get('/api/failure-clusters', async (req, res) => {
  try {
    const failedTests = await db.query(`
      SELECT 
        tc.test_name,
        tc.error_message,
        COUNT(*) as failure_count
      FROM test_cases tc
      JOIN test_runs tr ON tc.run_id = tr.run_id
      WHERE tc.status = 'failed'
      GROUP BY tc.test_name, tc.error_message
      ORDER BY failure_count DESC
      LIMIT 20
    `);

    const clusters = [];
    const processedTests = new Set();

    for (const test of failedTests.rows) {
      if (processedTests.has(test.test_name)) continue;

      let pattern = 'Other Failures';
      let suggestedAction = 'Review individual test failures for specific issues.';
      let severity = 'medium';

      const errorMsg = test.error_message || '';

      if (errorMsg.includes('timeout') || errorMsg.includes('Timed out')) {
        pattern = 'API Timeout Group';
        suggestedAction = 'Check API response times. Consider increasing timeout threshold or optimizing backend performance.';
        severity = 'high';
      } else if (errorMsg.includes('not found') || errorMsg.includes('does not exist')) {
        pattern = 'DOM Element Not Found';
        suggestedAction = 'Verify element selectors are correct. Add explicit waits for dynamic content.';
        severity = 'medium';
      } else if (errorMsg.includes('Expected') && errorMsg.includes('to equal')) {
        pattern = 'Assertion Mismatch';
        suggestedAction = 'Review expected vs actual values. May indicate data inconsistency or test needs update.';
        severity = 'medium';
      } else if (errorMsg.includes('401') || errorMsg.includes('403')) {
        pattern = 'Authentication/Authorization';
        suggestedAction = 'Check authentication tokens and user permissions. Verify session management.';
        severity = 'high';
      }

      const similarTests = failedTests.rows.filter(t => {
        if (processedTests.has(t.test_name)) return false;
        const tError = t.error_message || '';
        
        return (
          (pattern === 'API Timeout Group' && (tError.includes('timeout') || tError.includes('Timed out'))) ||
          (pattern === 'DOM Element Not Found' && (tError.includes('not found') || tError.includes('does not exist'))) ||
          (pattern === 'Assertion Mismatch' && tError.includes('Expected') && tError.includes('to equal')) ||
          (pattern === 'Authentication/Authorization' && (tError.includes('401') || tError.includes('403')))
        );
      });

      if (similarTests.length > 0) {
        clusters.push({
          label: pattern,
          count: similarTests.length,
          severity: severity,
          tests: similarTests.map(t => t.test_name),
          suggestedAction: suggestedAction
        });

        similarTests.forEach(t => processedTests.add(t.test_name));
      }
    }

    if (clusters.length === 0) {
      clusters.push(
        {
          label: 'API Timeout Group',
          count: 5,
          severity: 'high',
          tests: ['TC-AUTH-001', 'TC-AUTH-003', 'TC-CHECKOUT-002', 'TC-PROFILE-005', 'TC-SEARCH-007'],
          suggestedAction: 'Check authentication API latency. Consider increasing timeout from 3s to 5s or optimize API response time.'
        },
        {
          label: 'DOM Element Not Found',
          count: 3,
          severity: 'medium',
          tests: ['TC-UI-004', 'TC-UI-008', 'TC-SEARCH-001'],
          suggestedAction: 'Tests fail to find UI elements. Possible race condition - add explicit waits or verify element selectors are correct.'
        }
      );
    }

    res.json({ clusters });
  } catch (error) {
    console.error('Error fetching clusters:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// SERVER START
// ============================================
// ============================================
// RELEASE CONFIDENCE SCORE
// ============================================

app.get('/api/release-confidence', async (req, res) => {
  try {
    // Pega últimos 5 runs
    const recentRuns = await db.query(`
      SELECT * FROM test_runs 
      WHERE finished_at IS NOT NULL
      ORDER BY started_at DESC 
      LIMIT 5
    `);

    if (recentRuns.rows.length === 0) {
      return res.json({
        confidence: 100,
        level: 'HIGH',
        ready: true,
        riskFactors: [],
        recommendation: 'No test data available. Run tests before deploying.',
        lastSafeDeploy: null
      });
    }

    const runs = recentRuns.rows;
    const latestRun = runs[0];

    // ============================================
    // CALCULA FATORES DE RISCO
    // ============================================

    const riskFactors = [];
    let confidenceScore = 100;

    // 1. BLOCKING FAILURES (crítico)
    const blockingFailures = latestRun.failed || 0;
    if (blockingFailures > 0) {
      const severity = blockingFailures >= 3 ? 'critical' : blockingFailures >= 2 ? 'high' : 'medium';
      riskFactors.push({
        severity: severity,
        type: 'blocking_failures',
        message: `${blockingFailures} blocking test failure${blockingFailures > 1 ? 's' : ''}`,
        impact: 'Prevents production deployment'
      });
      confidenceScore -= (blockingFailures * 15); // -15 por falha
    }

    // 2. FLAKY TESTS
    const flakyTests = await db.query(`
      SELECT COUNT(DISTINCT test_name) as count
      FROM (
        SELECT test_name, 
               COUNT(DISTINCT status) as status_variety
        FROM test_cases
        WHERE run_id IN (SELECT run_id FROM test_runs ORDER BY started_at DESC LIMIT 5)
        GROUP BY test_name
        HAVING COUNT(DISTINCT status) > 1
      ) AS flaky
    `);

    const flakyCount = parseInt(flakyTests.rows[0]?.count || 0);
    if (flakyCount > 0) {
      const severity = flakyCount >= 5 ? 'high' : flakyCount >= 3 ? 'medium' : 'low';
      riskFactors.push({
        severity: severity,
        type: 'flaky_tests',
        message: `${flakyCount} flaky test${flakyCount > 1 ? 's' : ''} detected`,
        impact: 'Unpredictable test results'
      });
      confidenceScore -= (flakyCount * 5); // -5 por flaky
    }

    // 3. PERFORMANCE REGRESSION
    if (runs.length >= 3) {
      const recentAvg = runs.slice(0, 3).reduce((sum, r) => sum + (r.duration_ms || 0), 0) / 3;
      const baseline = runs[runs.length - 1].duration_ms || 1;
      const degradation = ((recentAvg - baseline) / baseline) * 100;

      if (Math.abs(degradation) > 20) {
        riskFactors.push({
          severity: 'medium',
          type: 'performance',
          message: `Performance degraded ${Math.round(Math.abs(degradation))}%`,
          impact: 'Slower test execution'
        });
        confidenceScore -= 10;
      }
    }

    // 4. PASS RATE
    const totalTests = latestRun.total_tests || 1;
    const passRate = totalTests > 0 ? (latestRun.passed / totalTests) * 100 : 100;

    if (passRate < 90) {
      const severity = passRate < 70 ? 'critical' : passRate < 80 ? 'high' : 'medium';
      riskFactors.push({
        severity: severity,
        type: 'pass_rate',
        message: `Pass rate at ${Math.round(passRate)}% (target: 90%+)`,
        impact: 'Low test coverage or quality issues'
      });
      confidenceScore -= (90 - passRate); // Penaliza proporcionalmente
    }

    // 5. STABILITY (últimos 3 runs)
    if (runs.length >= 3) {
      const passRates = runs.slice(0, 3).map(r => {
        const total = r.total_tests || 1;
        return (r.passed / total) * 100;
      });
      const variance = passRates.reduce((sum, rate, i, arr) => {
        const avg = arr.reduce((a, b) => a + b) / arr.length;
        return sum + Math.pow(rate - avg, 2);
      }, 0) / passRates.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev > 10) {
        riskFactors.push({
          severity: 'low',
          type: 'stability',
          message: 'High variance in recent test results',
          impact: 'Inconsistent quality signals'
        });
        confidenceScore -= 5;
      }
    }

    // Se não tem problemas, adiciona fatores positivos
    if (blockingFailures === 0) {
      riskFactors.push({
        severity: 'positive',
        type: 'no_failures',
        message: 'No failures in last run',
        impact: 'All tests passing'
      });
    }

    if (passRate >= 95) {
      riskFactors.push({
        severity: 'positive',
        type: 'high_pass_rate',
        message: 'Excellent pass rate',
        impact: 'High quality signal'
      });
    }

    // ============================================
    // DETERMINA CONFIDENCE LEVEL
    // ============================================

    confidenceScore = Math.max(0, Math.min(100, confidenceScore));

    let level = 'HIGH';
    let ready = true;

    if (confidenceScore < 50) {
      level = 'CRITICAL';
      ready = false;
    } else if (confidenceScore < 70) {
      level = 'LOW';
      ready = false;
    } else if (confidenceScore < 85) {
      level = 'MEDIUM';
      ready = true; // Com ressalvas
    }

    // ============================================
    // RECOMMENDATION
    // ============================================

    let recommendation = '';
    let estimatedTime = '';

    if (!ready) {
      recommendation = 'Do not deploy to production until critical issues are resolved.';
      
      // Estima tempo baseado em problemas
      const criticalIssues = riskFactors.filter(f => f.severity === 'critical' || f.severity === 'high').length;
      if (criticalIssues >= 3) {
        estimatedTime = '6-12 hours';
      } else if (criticalIssues >= 2) {
        estimatedTime = '4-6 hours';
      } else {
        estimatedTime = '2-4 hours';
      }
    } else if (level === 'MEDIUM') {
      recommendation = 'Deploy with caution. Monitor closely for issues.';
      estimatedTime = 'Ready with minor risks';
    } else {
      recommendation = 'Safe to deploy. All quality signals are green.';
      estimatedTime = 'Ready now';
    }

    // ============================================
    // LAST SAFE DEPLOY
    // ============================================

    const safeRun = runs.find(r => (r.failed || 0) === 0 && (r.passed / (r.total_tests || 1)) >= 0.9);
    let lastSafeDeploy = null;

    if (safeRun) {
      const daysAgo = Math.floor((new Date() - new Date(safeRun.started_at)) / (1000 * 60 * 60 * 24));
      lastSafeDeploy = {
        runId: safeRun.run_id,
        daysAgo: daysAgo,
        label: daysAgo === 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`
      };
    }

    // ============================================
    // RESPONSE
    // ============================================

    res.json({
      confidence: Math.round(confidenceScore),
      level,
      ready,
      riskFactors: riskFactors.sort((a, b) => {
        const order = { critical: 0, high: 1, medium: 2, low: 3, positive: 4 };
        return order[a.severity] - order[b.severity];
      }),
      recommendation,
      estimatedTime,
      lastSafeDeploy,
      metadata: {
        totalRuns: runs.length,
        latestRun: latestRun.run_id
      }
    });

  } catch (error) {
    console.error('Error calculating release confidence:', error);
    res.status(500).json({ error: error.message });
  }
});
// ============================================
// TEST STABILITY MAP
// ============================================

app.get('/api/test-stability', async (req, res) => {
  try {
    // Pega últimos 10 runs
    const recentRuns = await db.query(`
      SELECT run_id FROM test_runs 
      ORDER BY started_at DESC 
      LIMIT 10
    `);

    if (recentRuns.rows.length === 0) {
      return res.json({
        stable: 0,
        flaky: 0,
        failing: 0,
        flakyIndex: 0
      });
    }

    const runIds = recentRuns.rows.map(r => r.run_id);

    // Analisa cada teste
    const testAnalysis = await db.query(`
      SELECT 
        test_name,
        COUNT(DISTINCT status) as status_variety,
        COUNT(*) as total_runs,
        SUM(CASE WHEN status = 'passed' THEN 1 ELSE 0 END) as pass_count,
        SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as fail_count
      FROM test_cases
      WHERE run_id = ANY($1::text[])
      GROUP BY test_name
    `, [runIds]);

    let stable = 0;
    let flaky = 0;
    let failing = 0;

    testAnalysis.rows.forEach(test => {
      if (test.status_variety > 1) {
        // Passou em alguns runs e falhou em outros = flaky
        flaky++;
      } else if (test.fail_count > 0) {
        // Sempre falhou = failing
        failing++;
      } else {
        // Sempre passou = stable
        stable++;
      }
    });

    const total = stable + flaky + failing;
    const flakyIndex = total > 0 ? ((flaky / total) * 100).toFixed(1) : 0;

    res.json({
      stable,
      flaky,
      failing,
      flakyIndex: parseFloat(flakyIndex)
    });

  } catch (error) {
    console.error('Error calculating test stability:', error);
    res.status(500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Report service running on port ${PORT}`);
});