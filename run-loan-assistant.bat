@echo off
echo ===================================================
echo     Starting Loan Assistant Chatbot Services
echo ===================================================
echo.

if not defined JAVA_HOME (
    if exist "C:\Program Files\Eclipse Adoptium\jdk-26.0.2.101-hotspot" (
        set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-26.0.2.101-hotspot"
        set "PATH=%JAVA_HOME%\bin;%PATH%"
    )
)

echo [1/2] Starting Spring Boot Backend (Java 17+)...
start "Loan Assistant Backend" cmd /k "cd backend && .\mvnw spring-boot:run"

echo [2/2] Starting React Frontend (Vite)...
start "Loan Assistant Frontend" cmd /k "cd frontend && (if not exist node_modules npm install) && npm run dev"

echo.
echo Both services are starting in separate windows!
echo - The backend will be available at http://localhost:8080
echo - The frontend will be available at http://localhost:5173
echo.
echo You can close this window now. The services will continue running in the new windows.
pause
