import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    
    // Reporter
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/results/json',
      overwrite: false,
      html: false,
      json: true,
      timestamp: 'mmddyyyy_HHMMss'
    },
    
    setupNodeEvents(on, config) {
      let runId;
      const apiUrl = process.env.REPORT_API_URL || 'http://localhost:3001';

      // Before all tests
      on('before:run', async (details) => {
        runId = `run-${Date.now()}`;
        
   console.log(`\n📊 Creating test run: ${runId}`);
        
        try {
          const response = await fetch(`${apiUrl}/api/test-runs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              run_id: runId,
              browser: details.browser?.name || 'chrome',
              environment: process.env.ENV || 'dev',
              metadata: {
                specs: details.specs?.length,
                config: details.config
              }
            })
          });
          
          if (response.ok) {
            console.log('✅ Test run created successfully');
          } else {
            console.error('❌ Failed to create test run:', await response.text());
          }
        } catch (error) {
          console.error('❌ Error creating test run:', error.message);
        }
      });

      // After each spec
      on('after:spec', async (spec, results) => {
        if (!runId) return;

        console.log(`\n📝 Processing spec: ${spec.name}`);

        // Save each test case
        for (const test of results.tests || []) {
          for (const attempt of test.attempts) {
            try {
              await fetch(`${apiUrl}/api/test-cases`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  run_id: runId,
                  test_name: test.title.join(' > '),
                  test_file: spec.relative,
                  status: attempt.state,
                  duration_ms: attempt.duration,
                  error_message: attempt.error?.message || null,
                  stack_trace: attempt.error?.stack || null,
                  screenshots: attempt.screenshots || [],
                  video_path: results.video || null,
                  retry_count: test.attempts.length - 1
                })
              });
              
              console.log(`  ✓ Saved: ${test.title.join(' > ')} (${attempt.state})`);
            } catch (error) {
              console.error(`  ✗ Failed to save test case:`, error.message);
            }
          }
        }
      });

      // After all tests
      on('after:run', async (results) => {
        if (!runId) return;

        console.log(`\n📊 Finalizing test run: ${runId}`);

        try {
          const response = await fetch(`${apiUrl}/api/test-runs/${runId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: results.totalFailed === 0 ? 'passed' : 'failed',
              total_tests: results.totalTests,
              passed: results.totalPassed,
              failed: results.totalFailed,
              skipped: results.totalSkipped,
              duration_ms: results.totalDuration
            })
          });

          if (response.ok) {
            console.log('✅ Test run finalized successfully');
            console.log(`\n📈 Results:`);
            console.log(`   Total: ${results.totalTests}`);
            console.log(`   Passed: ${results.totalPassed}`);
            console.log(`   Failed: ${results.totalFailed}`);
            console.log(`   Duration: ${(results.totalDuration / 1000).toFixed(2)}s`);
          }
        } catch (error) {
          console.error('❌ Error finalizing test run:', error.message);
        }
      });
    },
  },
});