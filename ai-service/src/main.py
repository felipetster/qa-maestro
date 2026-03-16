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
async def analyze_run(run_id: str, lang: str = "en"):
    conn = None
    try:
        print(f"[AI SERVICE] 🔍 Starting analysis for {run_id} in {lang}...")
        
        db_url = os.getenv('DATABASE_URL', 'postgresql://qauser:qapass123@postgres:5432/qa_maestro')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()

        # Busca dados da run
        cursor.execute("""
            SELECT test_name, test_file, status, error_message, duration_ms 
            FROM test_cases 
            WHERE run_id = %s
        """, (run_id,))
        all_tests = cursor.fetchall()
        
        failed_tests = [t for t in all_tests if t[2] == 'failed']
        
        if not failed_tests:
            cursor.close()
            conn.close()
            return {
                "root_cause": "All tests passed" if lang == "en" else "Todos os testes passaram",
                "failure_type": "NONE",
                "evidence": "",
                "explanation": "",
                "is_flaky": False,
                "recovery_plan": [],
                "confidence": 100
            }

        # Monta prompt
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

        print(f"[AI SERVICE] 📊 Calling Ollama with model llama3.2:3b...")
        
        ollama_url = os.getenv('OLLAMA_HOST', 'http://host.docker.internal:11434')
        
        response = requests.post(
            f"{ollama_url}/api/generate",
            json={
                "model": "llama3.2:3b", 
                "prompt": prompt, 
                "format": "json",
                "stream": False,
                "options": {
                    "temperature": 0.1,
                    "num_predict": 500
                }
            },
            timeout=120
        )
        
        print(f"[AI SERVICE] ✅ Ollama responded with status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"[AI SERVICE] ❌ Ollama error: {response.text}")
            raise HTTPException(status_code=500, detail=f"Ollama error: {response.text}")
        
        # Parse resposta
        import json
        ollama_response = response.json()
        raw_text = ollama_response.get('response', '{}')
        
        print(f"[AI SERVICE] 📝 Raw response: {raw_text[:200]}...")
        
        # Tenta parse direto
        try:
            analysis = json.loads(raw_text)
        except json.JSONDecodeError:
            # Se falhar, extrai JSON do texto
            import re
            json_match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            if json_match:
                analysis = json.loads(json_match.group())
            else:
                analysis = {
                    "failure_type": "UNDEFINED",
                    "root_cause": "Unable to parse AI response",
                    "evidence": raw_text[:200],
                    "explanation": "AI analysis failed to produce valid JSON",
                    "is_flaky": False,
                    "recovery_plan": ["Review test logs manually"],
                    "confidence": 30
                }
        
        # Valida campos obrigatórios
        required_fields = ["failure_type", "root_cause", "recovery_plan"]
        for field in required_fields:
            if field not in analysis:
                analysis[field] = "Unknown" if field != "recovery_plan" else []
        
        # Salva no banco
        cursor.execute("""
            INSERT INTO ai_analyses (run_id, summary, root_cause, recommendation, confidence)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id
        """, (
            run_id,
            f"Analysis of {len(failed_tests)} failed tests",
            analysis.get('root_cause', 'Unknown'),
            analysis.get('recovery_plan', ['No recommendations'])[0] if analysis.get('recovery_plan') else 'No recommendations',
            analysis.get('confidence', 50)
        ))
        
        conn.commit()
        analysis_id = cursor.fetchone()[0]
        
        cursor.close()
        conn.close()
        
        print(f"[AI SERVICE] ✅ Analysis completed successfully: ID {analysis_id}")
        
        # Retorna para frontend
        return {
            "id": analysis_id,
            "run_id": run_id,
            "failure_type": analysis.get("failure_type", "UNDEFINED"),
            "root_cause": analysis.get("root_cause", "Unknown"),
            "evidence": analysis.get("evidence", "No evidence provided"),
            "explanation": analysis.get("explanation", "No explanation available"),
            "is_flaky": analysis.get("is_flaky", False),
            "recovery_plan": analysis.get("recovery_plan", []),
            "confidence": analysis.get("confidence", 50)
        }
        
    except requests.Timeout:
        if conn:
            conn.close()
        print(f"[AI SERVICE] ❌ TIMEOUT: Ollama took too long")
        raise HTTPException(status_code=504, detail="AI analysis timeout")
        
    except psycopg2.Error as e:
        if conn:
            conn.close()
        print(f"[AI SERVICE] ❌ DATABASE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    except Exception as e:
        if conn:
            conn.close()
        import traceback
        print(f"[AI SERVICE] ❌ UNEXPECTED ERROR: {str(e)}")
        print(f"[AI SERVICE] ❌ FULL TRACEBACK:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))