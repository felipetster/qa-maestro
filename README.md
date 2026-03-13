# QA Maestro

> Engineering Intelligence platform with AI-powered test analysis and real-time observability dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker)
![React](https://img.shields.io/badge/react-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/node.js-20-339933?logo=node.js)
![Python](https://img.shields.io/badge/python-3.11-3776AB?logo=python)

## Overview

**QA Maestro** transforms standard test automation into actionable Engineering Intelligence. Built with a microservices architecture, it integrates Cypress E2E testing with local AI (Ollama/LLaMA 3) to automatically analyze failures, detect flaky tests, and provide technical recovery plans in a centralized React dashboard.

## Core Features

* **AI Diagnostic Engine:** Automated root cause analysis and step-by-step recovery plans for failed Cypress tests.
* **Flaky Test Detection:** Identification of unstable test patterns and stability status mapping.
* **Observability Dashboard:** Real-time metrics, pass rates, and execution duration trends.
* **Seamless Integration:** Automated reporting, centralizing logs, screenshots, and test artifacts.

## Tech Stack

* **Frontend:** React 18, Vite, Recharts, TanStack Query
* **Backend:** Node.js / Express (Report API), Python / FastAPI (AI Service)
* **Database:** PostgreSQL 15
* **Testing & AI:** Cypress 13, Ollama (LLaMA 3.1 8B)
* **DevOps:** Docker & Docker Compose

## Quick Start

**Prerequisite:** Ensure you have Docker Desktop and [Ollama](https://ollama.com/) running locally (with the `llama3.1:8b` model pulled).

```bash
# 1. Clone the repository
git clone [https://github.com/felipetster/qa-maestro.git](https://github.com/felipetster/qa-maestro.git)
cd qa-maestro

# 2. Start all microservices
docker-compose up -d

# 3. Access the platform
# Dashboard: http://localhost:3000
# Demo Todo App: http://localhost:5173
