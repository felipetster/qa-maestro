@echo off
echo.
echo ========================================
echo    QA MAESTRO - Test Runner
echo ========================================
echo.

:: Verifica se app está rodando
echo [1/3] Verificando se app está rodando...
curl -s http://localhost:5173 > nul 2>&1
if %errorlevel% neq 0 (
    echo App nao esta rodando. Iniciando...
    start "QA Maestro App" cmd /k "npm run dev"
    echo Aguardando app inicializar...
    timeout /t 5 > nul
) else (
    echo App ja esta rodando!
)

:: Verifica API
echo.
echo [2/3] Verificando Report Service...
curl -s http://localhost:3001/health > nul 2>&1
if %errorlevel% neq 0 (
    echo API nao esta rodando!
    echo Execute: docker-compose up -d report-service
    pause
    exit /b 1
)
echo API respondendo!

:: Roda testes
echo.
echo [3/3] Executando testes...
echo.
npm run test

echo.
echo ========================================
echo    Testes finalizados!
echo    Resultados: http://localhost:3001/api/test-runs
echo ========================================
echo.
pause