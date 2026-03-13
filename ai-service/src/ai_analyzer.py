import httpx
import os
import json
from typing import Dict, List, Optional
from src.prompts import (
    SYSTEM_PROMPT,
    ANALYZE_TEST_RUN_PROMPT,
    ANALYZE_SINGLE_TEST_PROMPT,
    SUGGEST_FIX_PROMPT
)

class AIAnalyzer:
    def __init__(self):
        self.ollama_host = os.getenv('OLLAMA_HOST', 'http://localhost:11434')
        self.model = os.getenv('OLLAMA_MODEL', 'llama3.1:8b')
        
    async def _call_ollama(self, prompt: str) -> str:
        """Chama Ollama API"""
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    f"{self.ollama_host}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": f"{SYSTEM_PROMPT}\n\n{prompt}",
                        "stream": False,
                        "options": {
                            "temperature": 0.3,  # Mais determinístico
                            "top_p": 0.9,
                            "num_predict": 1000
                        }
                    }
                )
                
                if response.status_code == 200:
                    result = response.json()
                    return result.get('response', '')
                else:
                    raise Exception(f"Ollama API error: {response.status_code}")
                    
            except Exception as e:
                print(f"Error calling Ollama: {e}")
                raise
    
    async def analyze_test_run(self, run_data: Dict, failed_cases: List[Dict]) -> str:
        """Analisa um test run completo"""
        
        # Formata lista de testes falhados
        failed_tests_text = ""
        for idx, case in enumerate(failed_cases, 1):
            failed_tests_text += f"""
### {idx}. {case.get('test_name', 'Unknown')}
- Duration: {case.get('duration_ms', 0)}ms
- Error: {case.get('error_message', 'No error message')}
"""
        
        if not failed_tests_text:
            failed_tests_text = "No failed tests."
        
        # Monta prompt
        prompt = ANALYZE_TEST_RUN_PROMPT.format(
            run_id=run_data.get('run_id', 'unknown'),
            status=run_data.get('status', 'unknown'),
            total_tests=run_data.get('total_tests', 0),
            passed=run_data.get('passed', 0),
            failed=run_data.get('failed', 0),
            duration_ms=run_data.get('duration_ms', 0),
            browser=run_data.get('browser', 'unknown'),
            environment=run_data.get('environment', 'unknown'),
            failed_tests=failed_tests_text
        )
        
        # Chama IA
        analysis = await self._call_ollama(prompt)
        return analysis
    
    async def analyze_single_test(self, test_case: Dict) -> str:
        """Analisa um teste individual"""
        
        prompt = ANALYZE_SINGLE_TEST_PROMPT.format(
            test_name=test_case.get('test_name', 'Unknown'),
            status=test_case.get('status', 'unknown'),
            duration_ms=test_case.get('duration_ms', 0),
            error_message=test_case.get('error_message', 'No error'),
            stack_trace=test_case.get('stack_trace', 'No stack trace')
        )
        
        analysis = await self._call_ollama(prompt)
        return analysis
    
    async def suggest_fix(self, test_case: Dict, test_code: Optional[str] = None) -> str:
        """Sugere fix para teste falhado"""
        
        prompt = SUGGEST_FIX_PROMPT.format(
            test_name=test_case.get('test_name', 'Unknown'),
            error_message=test_case.get('error_message', 'No error'),
            test_code=test_code or '// Test code not available'
        )
        
        fix_suggestion = await self._call_ollama(prompt)
        return fix_suggestion
    
    async def health_check(self) -> Dict:
        """Verifica se Ollama está acessível"""
        async with httpx.AsyncClient(timeout=5.0) as client:
            try:
                response = await client.get(f"{self.ollama_host}/api/tags")
                if response.status_code == 200:
                    models = response.json().get('models', [])
                    return {
                        "status": "healthy",
                        "ollama_host": self.ollama_host,
                        "model": self.model,
                        "available_models": [m['name'] for m in models]
                    }
                else:
                    return {
                        "status": "unhealthy",
                        "error": f"Status code: {response.status_code}"
                    }
            except Exception as e:
                return {
                    "status": "unhealthy",
                    "error": str(e)
                }