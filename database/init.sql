-- qa maestro database schema
-- postgresql 15

-- tabela principal de test runs
CREATE TABLE test_runs (
    run_id VARCHAR(100) PRIMARY KEY,
    status VARCHAR(20) DEFAULT 'running',
    total_tests INTEGER DEFAULT 0,
    passed INTEGER DEFAULT 0,
    failed INTEGER DEFAULT 0,
    skipped INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    browser VARCHAR(50),
    environment VARCHAR(50),
    metadata JSONB,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP
);

CREATE INDEX idx_test_runs_status ON test_runs(status);
CREATE INDEX idx_test_runs_started ON test_runs(started_at DESC);

-- tabela de casos de teste individuais
CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(100) REFERENCES test_runs(run_id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_file VARCHAR(255),
    status VARCHAR(20) NOT NULL,
    duration_ms INTEGER DEFAULT 0,
    error_message TEXT,
    stack_trace TEXT,
    screenshots TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_test_cases_run_id ON test_cases(run_id);
CREATE INDEX idx_test_cases_status ON test_cases(status);
CREATE INDEX idx_test_cases_test_name ON test_cases(test_name);

-- tabela para rastreamento de testes flaky
CREATE TABLE flaky_tests (
    test_name VARCHAR(255) PRIMARY KEY,
    total_runs INTEGER DEFAULT 0,
    passed_runs INTEGER DEFAULT 0,
    failed_runs INTEGER DEFAULT 0,
    flaky_score DECIMAL(3,2) DEFAULT 0.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flaky_tests_score ON flaky_tests(flaky_score DESC);

-- tabela para analises de ia (nova - atualizada)
CREATE TABLE IF NOT EXISTS ai_analyses (
    id SERIAL PRIMARY KEY,
    run_id VARCHAR(255) NOT NULL,
    summary TEXT,
    root_cause TEXT,
    recommendation TEXT,
    confidence INTEGER DEFAULT 50,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (run_id) REFERENCES test_runs(run_id) ON DELETE CASCADE
);

CREATE INDEX idx_ai_analyses_run_id ON ai_analyses(run_id);
CREATE INDEX idx_ai_analyses_created ON ai_analyses(created_at DESC);

-- dados de exemplo (seed data)
INSERT INTO test_runs (run_id, status, total_tests, passed, failed, skipped, duration_ms, browser, environment, started_at, finished_at) VALUES
('run-001', 'passed', 10, 10, 0, 0, 12450, 'chrome', 'dev', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('run-002', 'failed', 10, 8, 2, 0, 15320, 'chrome', 'staging', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('run-003', 'passed', 10, 10, 0, 0, 11890, 'firefox', 'dev', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours');

INSERT INTO test_cases (run_id, test_name, test_file, status, duration_ms, error_message, stack_trace) VALUES
('run-001', 'TC001 - Load application correctly', 'todo.cy.js', 'passed', 1200, NULL, NULL),
('run-001', 'TC002 - Add new task', 'todo.cy.js', 'passed', 980, NULL, NULL),
('run-001', 'TC003 - Complete a task', 'todo.cy.js', 'passed', 1150, NULL, NULL),
('run-001', 'TC004 - Delete a task', 'todo.cy.js', 'passed', 890, NULL, NULL),
('run-001', 'TC005 - Clear completed tasks', 'todo.cy.js', 'passed', 1020, NULL, NULL),
('run-001', 'TC006 - Add task via Enter key', 'todo.cy.js', 'passed', 950, NULL, NULL),
('run-001', 'TC007 - Update remaining counter', 'todo.cy.js', 'passed', 1100, NULL, NULL),
('run-001', 'TC008 - Not add empty task', 'todo.cy.js', 'passed', 880, NULL, NULL),
('run-001', 'TC009 - Prevent duplicate tasks', 'todo.cy.js', 'passed', 920, NULL, NULL),
('run-001', 'TC010 - Filter tasks by status', 'todo.cy.js', 'passed', 1360, NULL, NULL),

('run-002', 'TC001 - Load application correctly', 'todo.cy.js', 'passed', 1180, NULL, NULL),
('run-002', 'TC002 - Add new task', 'todo.cy.js', 'passed', 1020, NULL, NULL),
('run-002', 'TC003 - Complete a task', 'todo.cy.js', 'failed', 2100, 'Expected element to be visible', 'AssertionError: Timed out retrying...'),
('run-002', 'TC004 - Delete a task', 'todo.cy.js', 'passed', 910, NULL, NULL),
('run-002', 'TC005 - Clear completed tasks', 'todo.cy.js', 'passed', 1050, NULL, NULL),
('run-002', 'TC006 - Add task via Enter key', 'todo.cy.js', 'passed', 970, NULL, NULL),
('run-002', 'TC007 - Update remaining counter', 'todo.cy.js', 'failed', 1850, 'Expected "2" to equal "3"', 'AssertionError: expected 2 to equal 3'),
('run-002', 'TC008 - Not add empty task', 'todo.cy.js', 'passed', 900, NULL, NULL),
('run-002', 'TC009 - Prevent duplicate tasks', 'todo.cy.js', 'passed', 940, NULL, NULL),
('run-002', 'TC010 - Filter tasks by status', 'todo.cy.js', 'passed', 1400, NULL, NULL),

('run-003', 'TC001 - Load application correctly', 'todo.cy.js', 'passed', 1230, NULL, NULL),
('run-003', 'TC002 - Add new task', 'todo.cy.js', 'passed', 990, NULL, NULL),
('run-003', 'TC003 - Complete a task', 'todo.cy.js', 'passed', 1100, NULL, NULL),
('run-003', 'TC004 - Delete a task', 'todo.cy.js', 'passed', 870, NULL, NULL),
('run-003', 'TC005 - Clear completed tasks', 'todo.cy.js', 'passed', 1030, NULL, NULL),
('run-003', 'TC006 - Add task via Enter key', 'todo.cy.js', 'passed', 960, NULL, NULL),
('run-003', 'TC007 - Update remaining counter', 'todo.cy.js', 'passed', 1120, NULL, NULL),
('run-003', 'TC008 - Not add empty task', 'todo.cy.js', 'passed', 890, NULL, NULL),
('run-003', 'TC009 - Prevent duplicate tasks', 'todo.cy.js', 'passed', 930, NULL, NULL),
('run-003', 'TC010 - Filter tasks by status', 'todo.cy.js', 'passed', 1380, NULL, NULL);

INSERT INTO flaky_tests (test_name, total_runs, passed_runs, failed_runs, flaky_score) VALUES
('TC003 - Complete a task', 3, 2, 1, 0.33),
('TC007 - Update remaining counter', 3, 2, 1, 0.33);