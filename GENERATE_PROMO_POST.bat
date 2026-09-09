@echo off
title Generate Tonight's Kansas Race Preview Post
color 0B
echo.
echo =======================================================
echo     Bandit Racing League Tonight's Race Preview
echo =======================================================
echo.
echo Running script...
python "%~dp0generate_upcoming_race_preview.py"
echo.
echo =======================================================
echo.
pause
