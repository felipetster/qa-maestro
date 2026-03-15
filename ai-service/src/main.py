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

@app.post("/api/analyze/run/{run_id}")
async def analyze_run(run_id: str, lang: str = "en"): # <-- parametro lang adicionado aqui!
    conn = None
    try:
        db_url = os.getenv('DATABASE_URL', 'postgresql://qauser:qapass123@postgres:5432/qa_maestro')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # 1. busca dados ricos de todos os testes da run
        cursor.execute("""
            SELECT test_name, test_file, status, error_message, duration_ms 
            FROM test_cases 
            WHERE run_id = %s
        """, (run_id,))
        all_tests = cursor.fetchall()
        
        failed_tests = [t for t in all_tests if t[2] == 'failed']
        if not failed_tests:
            return {"root_cause": "All tests passed"}

        # 2. instrucao de idioma dinamica
        language_instruction = ""
        if lang.lower() == "pt-br":
            language_instruction = """
INSTRUÇÃO CRÍTICA: Você DEVE gerar os valores do JSON ('root_cause', 'evidence', 'explanation', 'recovery_plan') INTEIRAMENTE em Português do Brasil (pt-BR) de forma técnica e profissional. 
Mantenha os nomes dos testes (ex: TC004) e termos técnicos de código originais.
"""
        else:
            language_instruction = "Respond entirely in professional English."

        # 3. prompt de raciocinio (the "chain of thought" prompt)
        prompt = f"""You are a Senior Site Reliability Engineer. 
Analyze these failures using evidence-based diagnostics.

{language_instruction}

CONTEXT:
Run ID: {run_id}
Total Failed Tests: {len(failed_tests)}
Data: {chr(10).join([f"TEST: {t[0]} | ERR: {t[3]} | DUR: {t[4]}ms" for t in failed_tests])}

DIAGNOSTIC MANDATE:
1. You MUST analyze ALL {len(failed_tests)} failed tests, not just the first one.
2. If there are multiple different errors (e.g. Timeout, Selector, Logic), classify FAILURE_TYPE as "MULTIPLE_FAILURES". If they are the same, classify them normally (e.g., UI_Timing, Selector_Mutation).
3. ROOT_CAUSE: Summarize ALL the different problems happening in this run.
4. EVIDENCE: Cite data points from ALL the failing tests (mention their specific test names).
5. RECOVERY_PLAN: Provide at least one specific technical step for EACH failed test.

RESPONSE FORMAT (JSON):
{{
  "failure_type": "TYPE_FROM_TAXONOMY",
  "root_cause": "summary addressing all failed tests",
  "evidence": "evidence from multiple tests",
  "explanation": "technical explanation covering all issues",
  "is_flaky": false,
  "recovery_plan": ["TC004: step...", "TC007: step...", "TC010: step..."],
  "confidence": 0-100
}}"""

        print(f"[AI SERVICE] Analyzing pattern for {run_id} in {lang.upper()}...")
        ollama_url = os.getenv('OLLAMA_HOST', 'http://host.docker.internal:11434')
        response = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": "llama3.1:8b", 
                "prompt": prompt, 
                "format": "json",
                "stream": False,
                "options": {"temperature": 0.1}
            },
            timeout=90
        )
        
        # o retorno agora e um json estruturado
        import json
        analysis = json.loads(response.json().get('response', '{}'))
        
        cursor.close()
        conn.close()
        
        return analysis

    except Exception as e:
        if conn: conn.close()
        raise HTTPException(status_code=500, detail=str(e))