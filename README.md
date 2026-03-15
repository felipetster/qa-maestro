[Leia em Português](README.pt-br.md)

# QA Maestro

> Engineering Intelligence Platform for automated test analysis and deployment decision support

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white)](docker-compose.yml)
[![React](https://img.shields.io/badge/react-18.2-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/python-3.11-3776AB?logo=python&logoColor=white)](https://python.org/)

---

## Overview

QA Maestro is an Engineering Intelligence Platform that transforms raw test execution data into actionable deployment insights. Built as a portfolio project, it demonstrates enterprise-grade architecture patterns, AI integration, and modern observability practices.

The platform addresses a critical bottleneck in software development: **test failure analysis**. Instead of manually reviewing logs, QA Maestro uses AI-powered diagnostics to identify root causes, detect patterns, and recommend specific recovery actions.

### Key Differentiators

- **Release Confidence Score**: Algorithmic deployment risk assessment based on test stability, pass rate, and performance metrics
- **AI Diagnostic Engine**: LLM-powered root cause analysis with technical recovery plans
- **Pattern Detection**: Automatic clustering of failures by error taxonomy (UI timing, API state, selector mutations)
- **Test Stability Mapping**: Visual identification of flaky vs. stable tests with Flaky Test Index calculation
- **Bilingual Interface**: Native support for English and Brazilian Portuguese

---

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    QA MAESTRO PLATFORM                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌───────────────┐   ┌──────────────┐  │
│  │   Dashboard  │──▶│ Report Service│──▶│  AI Service  │  │
│  │   React 18   │   │  Express API  │   │   FastAPI    │  │
│  │   Port 3000  │   │   Port 3001   │   │   Port 8000  │  │
│  └──────────────┘   └───────────────┘   └──────────────┘  │
│         │                   │                    │          │
│         │                   ▼                    ▼          │
│         │            ┌──────────────┐    ┌─────────────┐   │
│         │            │  PostgreSQL  │    │   Ollama    │   │
│         │            │   Port 5432  │    │  Port 11434 │   │
│         │            └──────────────┘    └─────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌──────────────┐   ┌──────────────┐                       │
│  │  Todo App    │──▶│   Cypress    │                       │
│  │  (Demo SUT)  │   │  E2E Suite   │                       │
│  │  Port 5173   │   │  10 tests    │                       │
│  └──────────────┘   └──────────────┘                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 + Vite | Dashboard UI with real-time metrics |
| **Report API** | Node.js + Express | Test data aggregation and metrics calculation |
| **AI Service** | Python + FastAPI | LLM orchestration and analysis engine |
| **Database** | PostgreSQL 15 | Persistent storage for test runs and analysis |
| **AI Model** | Ollama (LLaMA 3.2 3B) | Local inference for cost-effective diagnostics |
| **E2E Testing** | Cypress 13 | Demonstration test suite |
| **Container Orchestration** | Docker Compose | Multi-service deployment |

---

## Features

### 1. Release Confidence Score
Algorithmic calculation of deployment readiness based on:
- **Pass Rate** (40% weight): Percentage of passing tests
- **Stability Score** (35% weight): Variance analysis across recent runs
- **Performance Score** (25% weight): Execution time regression detection

**Output**: 0-100 score with risk level (LOW/MEDIUM/HIGH/CRITICAL) and estimated time to green.

### 2. AI Diagnostic Engine
Powered by LLaMA 3.2 3B running locally via Ollama:
- **Failure Classification**: Taxonomy-based categorization (UI_Timing, API_State_Mismatch, Selector_Mutation, etc.)
- **Evidence Extraction**: Specific data points supporting the diagnosis
- **Technical Recovery Plan**: Step-by-step remediation instructions
- **Confidence Scoring**: Probabilistic assessment of diagnosis accuracy

### 3. Test Stability Map
Visual representation of test suite health:
- **Stable Tests**: Consistent pass/fail behavior
- **Flaky Tests**: Intermittent failures across runs
- **Failing Tests**: Consistent failures
- **Flaky Test Index**: Percentage-based risk metric

### 4. Failure Pattern Detection
Automatic clustering of failures by:
- Error message similarity
- Affected test file patterns
- Temporal correlation
- Suggested fixes per cluster

### 5. Performance Trends
Historical analysis of test execution:
- Duration tracking per run
- Performance degradation alerts
- Baseline comparison

---

## Quick Start

### Prerequisites
- **Docker Desktop** (with Docker Compose)
- **Ollama** running locally ([installation guide](https://ollama.com))
- **LLaMA 3.2 3B model** pulled: `ollama pull llama3.2:3b`

### Installation
```bash
# 1. Clone repository
git clone https://github.com/felipetster/qa-maestro.git
cd qa-maestro

# 2. Start all services
docker-compose up -d

# 3. Wait for services to be ready (30-60s)
docker-compose logs -f

# 4. Access dashboard
# http://localhost:3000
```

### Generate Test Data
```bash
# Run Cypress E2E suite to populate dashboard
docker-compose run --rm cypress npx cypress run

# This creates a new test run with ~30 test cases
```

### Service Endpoints
- **Dashboard**: http://localhost:3000
- **Report API**: http://localhost:3001/health
- **AI Service**: http://localhost:8000/health
- **Demo App**: http://localhost:5173

---

## Usage

### 1. View Release Confidence
Navigate to the **Home** page to see the current deployment readiness score.

### 2. Analyze Test Runs
Go to **Test Runs** to view execution history. Click on any run to see detailed results.

### 3. Generate AI Analysis
On a run detail page with failures, click **"Run Diagnostic"** to trigger AI-powered root cause analysis. Analysis typically completes in 15-30 seconds on CPU.

### 4. Monitor Stability
The **Test Stability Map** shows which tests are reliable vs. flaky, helping prioritize test suite maintenance.

---

## Configuration

### Environment Variables
```bash
# Report Service
DATABASE_URL=postgresql://qauser:qapass123@postgres:5432/qa_maestro

# AI Service
OLLAMA_HOST=http://host.docker.internal:11434
OLLAMA_NUM_PARALLEL=4
```

### Ollama Performance Tuning
```bash
# CPU-optimized (default)
ollama pull llama3.2:3b  # Faster inference

# Higher quality (slower)
ollama pull llama3.1:8b  # Better analysis

# Update ai-service/src/main.py to change model
```

---

## Project Structure
```
qa-maestro/
├── dashboard/              # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   └── styles/         # CSS modules
│   └── Dockerfile
├── report-service/         # Node.js API
│   ├── src/
│   │   ├── server.js       # Express app
│   │   └── db.js           # PostgreSQL client
│   └── Dockerfile
├── ai-service/             # Python AI engine
│   ├── src/
│   │   └── main.py         # FastAPI + Ollama integration
│   └── Dockerfile
├── database/
│   └── init.sql            # Schema + seed data
├── microservices-demo/
│   └── todo-app/           # Demo application (SUT)
├── cypress/                # E2E test suite
│   └── e2e/
│       └── todo.cy.js      # 10 test cases
├── docker-compose.yml      # Orchestration
└── README.md
```

---

## Troubleshooting

### Dashboard shows 0 for Release Confidence
```bash
# Check if database has test runs
docker exec -it qa-maestro-db psql -U qauser -d qa_maestro \
  -c "SELECT COUNT(*) FROM test_runs;"

# If count is 0, generate data
docker-compose run --rm cypress npx cypress run
```

### AI Analysis times out
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Verify model is loaded
ollama list

# Pull smaller model for faster inference
ollama pull llama3.2:1b
```

### Services won't start
```bash
# Clean restart
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs -f
```

---

## Development Roadmap

- [ ] **CI/CD Integration**: Webhook endpoints for GitHub Actions / GitLab CI
- [ ] **Custom Run Naming**: User-defined labels instead of auto-generated IDs
- [ ] **Historical Trends**: 30-day pass rate and stability charts
- [ ] **Slack Notifications**: Real-time alerts for critical failures
- [ ] **API Authentication**: JWT-based access control
- [ ] **Export Reports**: PDF generation for stakeholder distribution

---

## Known Limitations

- **GPU Support**: AMD GPUs not supported by Ollama on Windows (CPU inference only)
- **Model Size**: Smaller models (3B parameters) sacrifice analysis depth for speed
- **Scale**: Optimized for small-to-medium test suites (<500 tests per run)
- **Language Support**: AI responses currently in English only (UI is bilingual)

---

## Contributing

This is a portfolio project and not actively seeking contributions. However, feedback and suggestions are welcome via Issues.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

## Author

**Felipe Castro**  
QA Analyst | Software Quality Engineer

- GitHub: [@felipetster](https://github.com/felipetster)
- LinkedIn: [linkedin.com/in/felipetster](https://linkedin.com/in/felipetster)
- Email: felipe.c.lima1604@gmail.com

---

## Acknowledgments

Built with:
- [Ollama](https://ollama.com) for local LLM inference
- [Meta LLaMA](https://ai.meta.com/llama/) for open-source language models
- [Cypress](https://cypress.io) for E2E testing framework
- [React](https://reactjs.org) and [Vite](https://vitejs.dev) for frontend tooling

---

**Note**: This project is for demonstration and portfolio purposes. It is not intended for production use without additional security hardening and scalability testing.
