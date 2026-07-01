@echo off
title Bandit Racing League Auto-Update Monitor
color 0E
echo.
echo =======================================================
echo     Bandit Racing League Auto-Update Monitor
echo =======================================================
echo.
echo Checking for new races...
python "%~dp0auto_update_league.py"
echo.
echo =======================================================
echo.
pause
