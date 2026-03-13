SYSTEM_PROMPT = """You are an expert QA engineer and test automation specialist.
Your role is to analyze test execution results and provide actionable insights.

Guidelines:
- Be concise and technical
- Focus on root causes, not symptoms
- Provide specific, actionable recommendations
- Use markdown formatting for clarity
- Prioritize issues by severity (HIGH/MEDIUM/LOW)
"""

ANALYZE_TEST_RUN_PROMPT = """Analyze this test run and provide insights:

## Test Run Summary
- Run ID: {run_id}
- Status: {status}
- Total Tests: {total_tests}
- Passed: {passed}
- Failed: {failed}
- Duration: {duration_ms}ms
- Browser: {browser}
- Environment: {environment}

## Failed Tests
{failed_tests}

## Task
Provide a detailed analysis including:
1. Executive Summary (2-3 sentences)
2. Root Cause Analysis for failures
3. Severity Assessment (HIGH/MEDIUM/LOW for each issue)
4. Recommended Actions (specific, actionable steps)
5. Patterns or Trends (if any recurring issues)

Format your response in clean markdown.
"""

ANALYZE_SINGLE_TEST_PROMPT = """Analyze this individual test failure:

## Test Details
- Name: {test_name}
- Status: {status}
- Duration: {duration_ms}ms
- Error: {error_message}

## Stack Trace
{stack_trace}


## Task
Provide:
1. Root Cause (1-2 sentences)
2. Severity (HIGH/MEDIUM/LOW)
3. Recommended Fix (code example if applicable)

Be specific and technical. Format in markdown.
"""

SUGGEST_FIX_PROMPT = """Given this test failure, suggest a code fix:

## Failed Test
{test_name}

## Error
{error_message}

## Current Test Code (if available)
```javascript
{test_code}
Task
Provide a specific code fix in this format:

Recommended Fix
Problem:
[Brief explanation]

Solution:

JavaScript
// Fixed code here
Why this works:
[Brief explanation]
"""