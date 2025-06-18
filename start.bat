@echo off
REM Windows start script for DigitalSignage

echo Installing dependencies...
npm install
if %ERRORLEVEL% NEQ 0 (
  echo npm install failed
  pause
  exit /b %ERRORLEVEL%
)

echo Running setup...
npm run setup
if %ERRORLEVEL% NEQ 0 (
  echo Setup failed
  pause
  exit /b %ERRORLEVEL%
)

echo Starting server...
npm run dev
pause
