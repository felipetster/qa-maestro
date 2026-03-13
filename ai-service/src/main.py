from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
import httpx
import os
import psycopg2
import requests
from dotenv import load_dotenv
from src.ai_analyzer import AIAnalyzer

load_dotenv()

app = FastAPI(title="QA Maestro AI Service", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ai = AIAnalyzer()

class AnalyzeTestRequest(BaseModel):
    test_case_id: int

@app.get("/health")
async def health_check():
    ai_health = await ai.health_check()
    return {"status": "healthy", "ai": ai_health}

# ==========================================================
# ENDPOINT DE ANÁLISE (O CORAÇÃO DA IA)
# ==========================================================
@app.post("/api/analyze/run/{run_id}")
async def analyze_run(run_id: str):
    conn = None
    try:
        db_url = os.getenv('DATABASE_URL', 'postgresql://qauser:qapass123@postgres:5432/qa_maestro')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # 1. Busca dados ricos de TODOS os testes da run (para detectar padrões)
        cursor.execute("""
            SELECT test_name, test_file, status, error_message, duration_ms 
            FROM test_cases 
            WHERE run_id = %s
        """, (run_id,))
        all_tests = cursor.fetchall()
        
        failed_tests = [t for t in all_tests if t[2] == 'failed']
        if not failed_tests:
            return {"root_cause": "All tests passed"}

        # 2. Heurística Simples de Padrões (Engineering Logic)
        error_messages = [t[3] for t in failed_tests]
        common_error = max(set(error_messages), key=error_messages.count)
        is_pattern = error_messages.count(common_error) > 1

        # 3. PROMPT DE RACIOCÍNIO (The "Chain of Thought" Prompt)
        # No main.py, atualize o prompt dentro de analyze_run:

        prompt = f"""You are a Senior Site Reliability Engineer and QA Architect. 
Analyze these failures using evidence-based diagnostics.

CONTEXT:
Run ID: {run_id}
Failed Tests: {len(failed_tests)}
Data: {chr(10).join([f"TEST: {t[0]} | ERR: {t[3]} | DUR: {t[4]}ms" for t in failed_tests])}

DIAGNOSTIC MANDATE:
1. Classify the FAILURE_TYPE using this taxonomy: [UI_Timing, Selector_Mutation, API_State_Mismatch, Environment_Instability, Logic_Error].
2. Identify EVIDENCE: Which specific numbers or strings prove your theory?
3. Provide TECHNICAL_STEPS: Commands or specific code changes. No generic "review" or "optimize".

RESPONSE FORMAT (JSON):
{{
  "failure_type": "TYPE_FROM_TAXONOMY",
  "root_cause": "technical summary",
  "evidence": "specific data points used",
  "explanation": "why this happened based on error logs",
  "is_flaky": true/false,
  "recovery_plan": ["technical step 1", "technical step 2"],
  "confidence": 0-100
}}"""

        print(f"[AI SERVICE] Analyzing pattern for {run_id}...")
        ollama_url = os.getenv('OLLAMA_HOST', 'http://host.docker.internal:11434')
        response = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": "llama3.1:8b", 
                "prompt": prompt, 
                "format": "json", # Força a IA a responder em JSON puro
                "stream": False,
                "options": {"temperature": 0.1} # Menos criatividade, mais precisão
            },
            timeout=90
        )
        
        # O retorno agora é um JSON estruturado
        import json
        analysis = json.loads(response.json().get('response', '{}'))
        
        cursor.close()
        conn.close()
        
        return analysis

    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=str(e))