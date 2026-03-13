# 🎯 QA Maestro

> Enterprise-grade QA automation platform with AI-powered test analysis and comprehensive reporting dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker)
![React](https://img.shields.io/badge/react-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/node.js-20-339933?logo=node.js)
![Python](https://img.shields.io/badge/python-3.11-3776AB?logo=python)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [AI Integration](#-ai-integration)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**QA Maestro** is a comprehensive quality assurance platform designed to automate testing workflows, provide AI-powered insights, and deliver actionable analytics through an intuitive dashboard.

Built with modern microservices architecture, the platform integrates:
- **Automated E2E testing** with Cypress
- **AI-powered analysis** using Ollama (local LLM)
- **Real-time reporting** via REST APIs
- **Interactive dashboard** with React

### Why QA Maestro?

- ✅ **Reduce test analysis time** from hours to minutes with AI
- ✅ **Identify flaky tests** automatically with ML algorithms
- ✅ **Track performance trends** across test runs
- ✅ **Generate actionable insights** for faster bug resolution
- ✅ **Centralize test results** in one beautiful dashboard

---

## ✨ Features

### 🤖 AI-Powered Analysis
- **Root Cause Identification:** LLM analyzes test failures and suggests likely causes
- **Automated Reporting:** Generate executive summaries of test runs
- **Code Fix Suggestions:** Get specific code recommendations for failing tests
- **Severity Assessment:** Automatic classification (HIGH/MEDIUM/LOW)

### 📊 Advanced Analytics
- **Flaky Test Detection:** ML-based algorithm identifies unstable tests
- **Performance Trends:** Track execution duration over time
- **Pass Rate Metrics:** Real-time success rate monitoring
- **Visual Dashboards:** Interactive charts with Recharts

### 🔄 Test Automation
- **Cypress E2E Suite:** 10+ pre-built test scenarios
- **API Integration:** Automatic result reporting to backend
- **Screenshot Capture:** Visual evidence for failures
- **Video Recording:** Full test execution replay

### 🎨 Modern Dashboard
- **Responsive Design:** Works on desktop and mobile
- **Real-time Updates:** Live test execution monitoring
- **Detailed Test Views:** Drill down into individual test cases
- **Export Capabilities:** Generate reports for stakeholders

---

## 🏗️ Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                         QA Maestro Platform                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │   Frontend   │    │   Cypress    │    │  AI Service  │     │
│  │   (React)    │◄───┤  Test Runner │◄───┤  (FastAPI)   │     │
│  │  Port: 3000  │    │              │    │  Port: 8000  │     │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘     │
│         │                   │                    │              │
│         └───────────────────┼────────────────────┘              │
│                             ▼                                   │
│                    ┌──────────────┐                             │
│                    │ Report API   │                             │
│                    │  (Node.js)   │                             │
│                    │  Port: 3001  │                             │
│                    └──────┬───────┘                             │
│                           ▼                                     │
│                    ┌──────────────┐                             │
│                    │  PostgreSQL  │                             │
│                    │  Port: 5432  │                             │
│                    └──────────────┘                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  External: Ollama (Local GPU)                          │    │
│  │  Port: 11434 - LLM inference for AI analysis           │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Microservices

| Service | Technology | Port | Purpose |
|---------|-----------|------|---------|
| **dashboard** | React 18 + Vite | 3000 | Interactive UI for visualization |
| **report-service** | Node.js + Express | 3001 | REST API for test results |
| **ai-service** | Python + FastAPI | 8000 | AI-powered analysis engine |
| **postgres** | PostgreSQL 15 | 5432 | Persistent data storage |
| **todo-app** | React (demo) | 5173 | Sample app for testing |
| **cypress** | Cypress 13.6 | - | E2E test execution |

---

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI framework
- **React Router 6.21** - Client-side routing
- **TanStack Query 5.17** - Server state management
- **Recharts 2.10** - Data visualization
- **Vite 5.0** - Build tool
- **Lucide React** - Icon library

### Backend
- **Node.js 20** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL 15** - Relational database
- **Python 3.11** - AI service runtime
- **FastAPI** - Python web framework

### Testing
- **Cypress 13.6** - E2E testing framework
- **Postman** - API testing

### AI/ML
- **Ollama** - Local LLM runtime
- **Llama 3.1 8B** - Language model
- **LLaVA 7B** - Multimodal vision model
- **scikit-learn** - ML algorithms

### DevOps
- **Docker & Docker Compose** - Containerization
- **Git & GitHub** - Version control

---

## 🚀 Getting Started

### Prerequisites
```bash
# Required
- Docker Desktop 4.0+
- Node.js 20+ (for local development)
- Git
- 8GB RAM minimum
- 20GB free disk space

# For AI features
- Ollama (https://ollama.com)
- NVIDIA GPU (recommended) or CPU fallback
```

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/felipetster/qa-maestro.git
cd qa-maestro
```

#### 2. Install Ollama (for AI features)

**Windows:**
```bash
# Download from https://ollama.com/download/windows
# Install and run

# Pull AI models
ollama pull llama3.1:8b
ollama pull llava:7b
```

**macOS:**
```bash
brew install ollama
ollama pull llama3.1:8b
ollama pull llava:7b
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.1:8b
ollama pull llava:7b
```

#### 3. Start the platform
```bash
# Build and start all services
docker-compose up -d

# Verify all containers are running
docker-compose ps

# Expected output:
# qa-maestro-postgres-1        Up (healthy)
# qa-maestro-todo-app-1        Up
# qa-maestro-report-service-1  Up
# qa-maestro-ai-service-1      Up
# qa-maestro-dashboard-1       Up
# qa-maestro-cypress-1         Up
```

#### 4. Access the platform

- **Dashboard:** http://localhost:3000
- **Todo App (demo):** http://localhost:5173
- **Report API:** http://localhost:3001/health
- **AI Service:** http://localhost:8000/health

---

## 📖 Usage

### Running Tests

#### Option 1: Windows Batch Script
```bash
cd microservices-demo/todo-app
./run-tests.bat
```

#### Option 2: Docker Exec
```bash
docker-compose exec cypress npx cypress run \
  --config baseUrl=http://todo-app:5173 \
  --env REPORT_API_URL=http://report-service:3001
```

#### Option 3: Manual with npm
```bash
cd microservices-demo/todo-app
npm install
npm run test
```

### Viewing Results

1. **Dashboard Home:** Navigate to http://localhost:3000
2. **Test Runs:** Click "Test Runs" in sidebar
3. **Details:** Click any run to see individual test cases
4. **AI Analysis:** Click "Generate Analysis" on failed runs

### Triggering AI Analysis

**Via Dashboard:**
- Navigate to a test run with failures
- Click "Generate Analysis" button
- Wait 10-30 seconds for AI processing

**Via API:**
```bash
curl -X POST http://localhost:3001/api/test-runs/{runId}/analyze
```

**Via Direct AI Service:**
```bash
curl -X POST http://localhost:8000/api/analyze/run/{runId}
```

---

## 📡 API Documentation

### Report Service Endpoints

#### Get All Test Runs
```http
GET /api/test-runs
```

**Response:**
```json
[
  {
    "run_id": "run-1234567890",
    "status": "passed",
    "total_tests": 10,
    "passed": 10,
    "failed": 0,
    "duration_ms": 12450,
    "browser": "chrome",
    "environment": "dev",
    "started_at": "2026-03-10T14:30:00Z"
  }
]
```

#### Get Single Test Run
```http
GET /api/test-runs/:runId
```

**Response:**
```json
{
  "run": { /* run details */ },
  "cases": [
    {
      "test_name": "TC001 - Load application",
      "status": "passed",
      "duration_ms": 1200,
      "error_message": null
    }
  ]
}
```

#### Get Statistics
```http
GET /api/stats
```

**Response:**
```json
{
  "total_tests": 30,
  "total_passed": 28,
  "total_failed": 2,
  "total_runs": 3
}
```

#### Create Test Run
```http
POST /api/test-runs
Content-Type: application/json

{
  "run_id": "run-1234567890",
  "browser": "chrome",
  "environment": "staging"
}
```

#### Get AI Analysis
```http
GET /api/test-runs/:runId/analysis
```

**Response:**
```json
{
  "run_id": "run-1234567890",
  "analysis_text": "## Executive Summary\n\nTest run completed with 2 failures...",
  "severity": "HIGH",
  "created_at": "2026-03-10T14:35:00Z"
}
```

### AI Service Endpoints

#### Analyze Test Run
```http
POST /api/analyze/run/:runId
```

#### Analyze Screenshot
```http
POST /api/analyze/screenshot
Content-Type: application/json

{
  "image_path": "/path/to/screenshot.png",
  "test_name": "TC003",
  "error_message": "Element not found"
}
```

#### Detect Flaky Test
```http
POST /api/analyze/flaky/:testName
```

#### Performance Trends
```http
POST /api/analyze/performance
```

---

## 🤖 AI Integration

### How It Works

1. **Test Execution:** Cypress runs tests and reports results to Report Service
2. **Failure Detection:** Report Service identifies failed runs
3. **Auto-Trigger:** System automatically calls AI Service for failed runs
4. **Analysis:** Ollama LLM analyzes failures and generates insights
5. **Storage:** Analysis saved to PostgreSQL
6. **Display:** Dashboard fetches and renders AI insights

### AI Capabilities

#### 1. Root Cause Analysis
```
Input: Test failure data
Output: Most likely cause + confidence level
```

**Example:**
```markdown
## Root Cause Analysis

**Test:** TC003 - Complete a task
**Error:** Expected element [data-cy='task-item'] but never found it

**Likely Cause:** The task creation functionality is not updating the DOM 
properly. This could be due to:
1. State management issue (React state not triggering re-render)
2. API call not completing before assertion
3. Selector mismatch between test and component

**Severity:** HIGH
**Confidence:** 85%
```

#### 2. Code Fix Suggestions
```
Input: Failed test + error message
Output: Specific code fix with explanation
```

**Example:**
```javascript
// BEFORE (failing)
cy.get('[data-cy="add-task"]').click();
cy.get('[data-cy="task-item"]').should('exist');

// AFTER (fixed)
cy.get('[data-cy="add-task"]').click();
cy.wait(500); // Wait for state update
cy.get('[data-cy="task-item"]').should('exist');

// Why: React state updates are asynchronous. Adding explicit 
// wait ensures DOM has updated before assertion.
```

#### 3. Flaky Test Detection

**Algorithm:**
```python
flaky_score = (
    pass_rate_score * 0.5 +      # Unstable pass rate
    duration_variance * 0.2 +     # Inconsistent timing
    alternation_pattern * 0.3     # Pass/fail/pass pattern
)

if flaky_score >= 0.3:
    recommendation = "QUARANTINE"
```

**Output:**
```json
{
  "is_flaky": true,
  "flaky_score": 0.65,
  "confidence": "HIGH",
  "recommendation": "QUARANTINE",
  "pattern": "Test alternates between pass and fail",
  "root_cause": "Likely timing issue or race condition"
}
```

---

## 📸 Screenshots

### Dashboard Home
![Dashboard Home](./screenshots/01-dashboard-home.png)
*Overview with key metrics and performance trends*

### Test Runs List
![Test Runs](./screenshots/02-test-runs-list.png)
*Complete history of all test executions*

### Run Details with AI Analysis
![Run Details](./screenshots/03-run-details-ai.png)
*Individual test cases with AI-powered insights*

### Analytics
![Analytics](./screenshots/04-analytics.png)
*Performance trends and flaky test detection*

---

## 📁 Project Structure
```
qa-maestro/
├── database/
│   └── init.sql                    # PostgreSQL schema + seed data
│
├── microservices-demo/
│   └── todo-app/                   # Demo React app for testing
│       ├── src/
│       ├── cypress/
│       │   └── e2e/
│       │       └── todo.cy.js      # 10 E2E test scenarios
│       ├── cypress.config.js       # Cypress + API integration
│       └── run-tests.bat           # One-click test runner
│
├── report-service/                 # Node.js REST API
│   ├── src/
│   │   ├── server.js               # Express app + routes
│   │   └── db.js                   # PostgreSQL client
│   ├── Dockerfile
│   └── package.json
│
├── ai-service/                     # Python AI engine
│   ├── src/
│   │   ├── main.py                 # FastAPI app
│   │   ├── ai_analyzer.py          # LLM integration
│   │   ├── flaky_detector.py       # ML algorithm
│   │   └── prompts.py              # AI prompts
│   ├── Dockerfile
│   └── requirements.txt
│
├── dashboard/                      # React frontend
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Route pages
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── utils/                  # API client
│   │   ├── styles/                 # CSS
│   │   ├── App.jsx                 # Router setup
│   │   └── main.jsx                # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── test-results/                   # Cypress artifacts
│   ├── videos/
│   └── screenshots/
│
├── screenshots/                    # Documentation images
│
├── docker-compose.yml              # Orchestration config
└── README.md                       # This file
```

---

## 🧪 Development

### Local Development (without Docker)

#### Report Service
```bash
cd report-service
npm install
export DATABASE_URL=postgresql://qauser:qapass123@localhost:5432/qa_maestro
npm run dev
```

#### AI Service
```bash
cd ai-service
pip install -r requirements.txt
export OLLAMA_HOST=http://localhost:11434
python -m uvicorn src.main:app --reload --port 8000
```

#### Dashboard
```bash
cd dashboard
npm install
export VITE_API_URL=http://localhost:3001
export VITE_AI_URL=http://localhost:8000
npm run dev
```

### Running Tests Locally
```bash
cd microservices-demo/todo-app
npm install

# Interactive mode
npm run cypress:open

# Headless mode
npm run test
```

### Debugging

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f dashboard
docker-compose logs -f ai-service
docker-compose logs -f postgres
```

**Connect to database:**
```bash
docker-compose exec postgres psql -U qauser -d qa_maestro

# Example queries
SELECT * FROM test_runs ORDER BY started_at DESC LIMIT 5;
SELECT * FROM ai_analyses;
```

**Rebuild service:**
```bash
docker-compose build dashboard
docker-compose up -d dashboard
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all services build successfully
- Test AI integration before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Felipe Castro**  
QA Analyst | Test Automation | AI Enthusiast

- GitHub: [@felipetster](https://github.com/felipetster)
- LinkedIn: [Felipe Castro](https://linkedin.com/in/felipecastro)
- Portfolio: [felipecastro.dev](https://felipecastro.dev)

---

## 🙏 Acknowledgments

- **Ollama** - For making local LLM inference accessible
- **Meta** - Llama 3.1 language model
- **Cypress** - Excellent E2E testing framework
- **Recharts** - Beautiful charting library
- **Docker** - Simplified deployment

---

## 📊 Project Stats

- **Lines of Code:** ~5,000+
- **Test Cases:** 10 automated E2E tests
- **Services:** 6 microservices
- **AI Models:** 2 (Llama 3.1 8B + LLaVA 7B)
- **API Endpoints:** 15+
- **Database Tables:** 4

---

**Built with ❤️ for the QA community**