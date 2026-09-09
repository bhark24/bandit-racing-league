@echo off
title Bandit Racing League Auto-Update Monitor
color 0E
echo.
echo =======================================================
echo     Bandit Racing League Auto-Update Monitor
echo =======================================================
echo Auto-restoring all fleet chassis to 100%...
python "%~dp0restore_all_chassis.py"
echo.
echo Checking for new races...
python "%~dp0auto_update_league.py"
echo.
echo =======================================================
echo.
pause
