[Leia em Português](README.pt-br.md)

# QA Maestro

> Engineering Intelligence platform with AI-powered test analysis and real-time observability dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker)
![React](https://img.shields.io/badge/react-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/node.js-20-339933?logo=node.js)
![Python](https://img.shields.io/badge/python-3.11-3776AB?logo=python)

QA Maestro is a personal portfolio project I developed to explore how we can use Artificial Intelligence (LLMs) and observability to solve one of the biggest bottlenecks in software development: analyzing failed tests.

## What it was designed to do
The core idea was born from a real pain point: reading automated test logs (like Cypress) is a slow and tedious process. When a pipeline breaks, developers and QAs spend too much time trying to figure out if the failure was a real bug, a flaky test, or an infrastructure issue.

QA Maestro acts as an observability layer on top of executed tests. The goal is for the tool to read raw results, calculate the risk level of a deploy (Release Confidence), and use AI to not just tell you *where* it failed, but *why* it failed and *how* to fix it.

## Architecture

```text
┌─────────────────────────────────────────────┐
│            QA MAESTRO PLATFORM              │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Frontend │→ │ Reports  │→ │ AI Engine│   │
│  │  React   │  │  Node.js │  │  Python  │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                      ↓             ↓        │
│                ┌──────────────┐ ┌─────────┐ │
│                │  PostgreSQL  │ │ Ollama  │ │
│                └──────────────┘ └─────────┘ │
└─────────────────────────────────────────────┘
What it does today
Currently, the project functions as a complete dashboard built with a microservices architecture. The main active features are:

AI Diagnostic Engine: Integration with a local model (LLaMA 3.1 via Ollama) that analyzes test error messages, clusters failure patterns, and generates a Technical Recovery Plan.

Release Confidence: An algorithm that calculates the health of the test suite, penalizing flaky tests, blocking failures, and performance degradation.

Test Stability Map: Visual mapping that separates stable tests from flaky ones.

Technical & Bilingual Design: Interface with a brutalist/engineering design and native internationalization support (English and Brazilian Portuguese).

Tech Stack
Frontend: React 18, Vite, Context API, JetBrains Mono typography.

Backend: Node.js / Express (Report API) to manage metrics.

AI Service: Python / FastAPI orchestrating calls to Ollama (LLaMA 3.1 8B).

Database: PostgreSQL 15.

Testing: Cypress 13.

DevOps: Docker & Docker Compose.

Quick Start
Prerequisite: Ensure you have Docker Desktop and Ollama running locally (with the llama3.1:8b model pulled).

Bash
# 1. Clone the repository
git clone [https://github.com/felipetster/qa-maestro.git](https://github.com/felipetster/qa-maestro.git)
cd qa-maestro

# 2. Start all microservices
docker-compose up -d

# 3. Access the dashboard
# http://localhost:3000
Future Improvements (Roadmap)
Like any portfolio project, it is constantly evolving. The next steps include:

100% Dynamic Translation: Ensure that all responses coming from the backend and AI are perfectly translated according to the user's preference without static keys.

Run Customization: Allow renaming "Test Runs" (e.g., changing from "run-001" to "Release v2.4") for better organization.

AI Optimization: Refine prompt engineering and improve log chunking to avoid exceeding the AI's token limit during massive failures.

CI/CD Webhooks: Create endpoints to receive real payloads directly from GitHub Actions or GitLab CI.

Author
Felipe Castro

GitHub: @felipetster

LinkedIn: linkedin.com/in/felipetster

Email: felipe.c.lima1604@gmail.com