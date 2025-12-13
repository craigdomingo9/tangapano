@echo off
TITLE Secure Tunnel to Tangapano VPS

:: --- CONFIGURATION ---
set VPS_USER=deploy
set VPS_HOST=tangapano.co.zw
:: Path to key is usually optional if you have it in C:\Users\You\.ssh\id_rsa
:: otherwise add: -i "C:\path\to\key.pem" to the ssh command below

cls
echo ======================================================
echo   Establishing Secure Tunnel to %VPS_HOST%...
echo ======================================================
echo.
echo   Mapping the following secure channels:
echo     [PgAdmin]          http://localhost:5050
echo     [Grafana]          http://localhost:9001
echo     [Redis Commander]  http://localhost:8081
echo     [PostgreSQL]       localhost:5433  (Access DB directly)
echo.
echo   ----------------------------------------------------
echo    DO NOT CLOSE THIS WINDOW while using the tools.
echo   ----------------------------------------------------
echo.

:: The SSH Command
:: Windows 10/11 comes with OpenSSH installed by default.
ssh -N ^
 -L 5050:127.0.0.1:5050 ^
 -L 9001:127.0.0.1:9001 ^
 -L 8081:127.0.0.1:8081 ^
 -L 5433:127.0.0.1:5432 ^
 %VPS_USER%@%VPS_HOST%

:: If SSH fails or closes, pause so you can see the error
pause